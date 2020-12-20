import Storage from '../src/storage';

const Display = (() => {
    const _navHeader = document.querySelector('.nav-header');
    const _projectList = document.querySelector('#project-list');
    const _projectView = document.querySelector('#project-view');
    const _projectTitle = _projectView.querySelector('#project-title');

    const _taskList = document.querySelector('#task-list');
    const _addTaskItem = document.querySelector('.add-task-item');

    const _taskForm = document.querySelector('.task-form');
    const _taskFormSaveButton = _taskForm.querySelector('.save-button');
    const _taskFormCancelButton = _taskForm.querySelector('.cancel-button');

    const init = () => {
        const _labelToggles = document.querySelectorAll('.label-toggle');
        const _inputToggles = document.querySelectorAll('.input-toggle');

        _labelToggles.forEach(labelToggle => {
            labelToggle.addEventListener('click', toggleLabelInput);
        });

        _inputToggles.forEach(inputToggle => {
            inputToggle.addEventListener('focusout', toggleLabelInput);
            let id = inputToggle.id;

            switch (id) {
                case 'add-project-input':
                    inputToggle.addEventListener('change', createProject);
                    break;

                case 'add-task-input':
                    inputToggle.addEventListener('change', createTask)
                    break;

                default:
                    console.error('Unknown input');
                    break;
            }
        });
        _navHeader.addEventListener('click', toggleProjectList);
        _taskFormSaveButton.addEventListener('click', toggleTaskForm);
        _taskFormCancelButton.addEventListener('click', toggleTaskForm);
        populateProjectList();
    };

    const getProject = (id) => {
        _projectList.querySelectorAll('.project').find(task => task.dataset.taskid === id);
    };

    const getTask = (id) => {
        const taskEls = _taskList.querySelectorAll('.task');
        return Array.from(taskEls).find(task => task.dataset.taskid === id);
    };

    const toggleProjectList = (e) => {
        if (!e.target.classList.contains('nav-header')) return;

        let items = document.querySelectorAll('li');
        let chevron = _navHeader.querySelector('i');

        items.forEach(item => {
            item.classList.toggle('nav-item--expanded');
        });
        chevron.classList.toggle('nav-chevron--rotate');
    };

    const toggleLabelInput = (e) => {
        let target = e.target;
        let classes = target.classList;

        if (classes.contains('label-toggle')) {
            classes.toggle('label-toggle--hidden');
            let input = target.nextElementSibling;
            if (input.classList.toggle('input-toggle--shown')) input.focus();
        }

        if (classes.contains('input-toggle')) {
            classes.toggle('input-toggle--shown');
            let label = target.previousElementSibling;
            label.classList.toggle('label-toggle--hidden');
            target.value = '';
        }
    };
    
    const populateProjectList = () => {
        let projects = Storage.getProjects();
        if (!projects) return;
        projects.forEach(project => {
            addToProjectList(project);
        });
    };

    const addToProjectList = (project) => {
        const navItemTemplate = document.querySelector('#nav-item-template');
        const projectList = _navHeader.querySelector('ul');

        let clone = navItemTemplate.content.cloneNode(true);
        let item = clone.querySelector('li');
        let trash = clone.querySelector('i');

        item.dataset.projectid = project.getID();

        item.insertAdjacentHTML('afterbegin', project.getTitle());
        projectList.insertBefore(clone, projectList.lastElementChild);

        item.addEventListener('click', showProject);
        trash.addEventListener('click', removeProject);
        item.classList.add('project');
    }

    const createProject = (e) => {
        let title = e.target.value;
        if (title.trim() === '') return;

        let project = Storage.addProject(title);
        if (project) addToProjectList(project);
        e.target.value = '';
        e.target.blur();
    };

    const showProject = (e) => {
        let id = e.target.dataset.projectid;
        if (!id) return;

        let project = Storage.getProject(id);
        if (!project) return;
        
        // Empty task list
        while (_taskList.hasChildNodes() && !_taskList.firstElementChild.classList.contains('add-task-item')) {
            _taskList.firstElementChild.remove();
        }
        
        _projectTitle.innerText = project.getTitle();
        _projectTitle.dataset.projectid = id;
        
        let tasks = project.getTasks();
        if (tasks) {
            tasks.forEach(task => addToTaskList(task));
            _addTaskItem.classList.add('add-task-item--visible');
        }
    };

    const removeProject = (e) => {
        // TODO: Add confirmation dialog
        if (e.target.classList.contains('fa-trash-alt')) {
            let id = e.target.closest('li').dataset.projectid;
            Storage.removeProject(id);
            e.target.parentNode.remove();
        }
    };

    const createTask = (e) => {
        let taskTitle = e.target.value;
        if (taskTitle.trim() === '') return;

        let projectID = _projectTitle.dataset.projectid;
        let task = Storage.addTaskToProject(taskTitle, projectID);
        if (task) addToTaskList(task);
        e.target.value = '';
        e.target.blur();
    };

    const addToTaskList = (task) => {
        const taskTemplate = document.querySelector('#task-template');
        let clone = taskTemplate.content.firstElementChild.cloneNode(true);
        let done = clone.querySelector('.task-done');
        let title = clone.querySelector('.task-title');
        let trash = clone.querySelector('.fa-trash-alt');

        clone.dataset.taskid = task.getID();

        done.checked = task.isDone();
        title.innerText = task.getTitle();
        _taskList.insertBefore(clone, _taskList.lastElementChild);

        clone.addEventListener('click', toggleTaskForm);
        trash.addEventListener('click', removeTask);
    };

    const removeTask = (e) => {
        if (e.target.classList.contains('fa-trash-alt')) {
            let task = e.target.closest('li');
            let taskID = task.dataset.taskid;
            let projectID = _projectTitle.dataset.projectid;
            Storage.removeTaskFromProject(taskID, projectID);
            task.remove();
        }
    };
    
    const toggleTaskForm = (e) => {
        e.preventDefault();
        let classes = e.target.classList;
        let projectID = _projectTitle.dataset.projectid;

        if (classes.contains('task')) {
            // Open form and show task details
            let taskID = e.target.dataset.taskid;
            let project = Storage.getProject(projectID);
            let task = project.getTask(taskID);
            _taskForm.dataset.taskid = taskID;
            if (!task) return;
            populateTaskForm(task);

        } else if (classes.contains('save-button')) {
            // Update task properties "if" changed
            let taskID = _taskForm.dataset.taskid;
            let title = _taskForm.querySelector('.task-form-title').innerText;
            let desc = _taskForm.querySelector('.task-form-desc').innerText;
            let date = _taskForm.querySelector('.task-form-date').valueAsDate;
            let priorities = Array.from(_taskForm.querySelectorAll('input[type=radio]'));
            let priority = priorities.indexOf(priorities.find(priority => priority.checked));
            let done = _taskForm.querySelector('.task-form-done').checked;
            let task = Storage.updateTask(projectID, taskID, title, desc, date, priority, done);
            updateTask(task);

        } else if (!classes.contains('cancel-button')) {
            return;
        }
        // TODO: Dont show form in case task doesnt exist
        _taskForm.classList.toggle('task-form--visible');
    };

    const populateTaskForm = (task) => {
        const title = _taskForm.querySelector('.task-form-title');
        const desc = _taskForm.querySelector('.task-form-desc');
        const date = _taskForm.querySelector('.task-form-date');
        const priorities = _taskForm.querySelectorAll('input[type=radio]');
        const done = _taskForm.querySelector('.task-form-done');

        title.innerText = task.getTitle();
        desc.innerText = task.getDesc();
        date.valueAsDate = task.getDate();
        Array.from(priorities)[task.getPriority()].checked = true;
        done.checked = task.isDone();
    };

    const updateTask = (task) => {
        let taskEl = getTask(task.getID());
        let title = taskEl.querySelector('.task-title');
        let done = taskEl.querySelector('.task-done');
        title.innerText = task.getTitle();
        done.checked = task.isDone();
    };

    return {
        init
    };
})();

export default Display;
