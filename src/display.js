import Storage from '../src/storage';

const Display = (() => {
    const _wrapper = document.querySelector('#wrapper');
    const _navHeader = document.querySelector('.nav-header');
    const _projectView = document.querySelector('#project-view');
    const _labelToggles = document.querySelectorAll('.label-toggle');
    const _inputToggles = document.querySelectorAll('.input-toggle');
    const _taskList = document.querySelector('#task-list');
    const _projectTitle = _projectView.querySelector('#project-title');
    const _taskForm = document.querySelector('.task-form');
    const _taskFormCancelButton = _taskForm.querySelector('.cancel-button');

    const init = () => {
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
        _taskFormCancelButton.addEventListener('click', toggleTaskForm);
        populateProjectList();
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

        item.insertAdjacentHTML('afterbegin', project.getTitle());
        projectList.insertBefore(clone, projectList.lastElementChild);

        item.addEventListener('click', showProject);
        trash.addEventListener('click', removeProject);
    }

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

    const createProject = (e) => {
        let title = e.target.value;
        if (title.trim() === '') return;

        let project = Storage.addProject(title);
        if (project) addToProjectList(project);
        e.target.value = '';
        e.target.blur();
    };

    const showProject = (e) => {
        let title = e.target.innerText;
        if (!title) return;

        let project = Storage.getProject(title);
        if (!project) return;
        
        // Empty task list
        while (_taskList.hasChildNodes() && _taskList.firstChild.id !== 'add-task-item') {
            _taskList.firstChild.remove();
        }

        _projectTitle.innerText = project.getTitle();
        
        let tasks = project.getTasks();
        if (tasks) tasks.forEach(task => addToTaskList(task));
    };

    const removeProject = (e) => {
        // Add confirmation dialog!
        if (e.target.classList.contains('fa-trash-alt')) {
            let title = e.target.closest('li').innerText;
            let deleted = Storage.removeProject(title);
            if (deleted) e.target.parentNode.remove();
        }
    };
    
    const toggleAddTask = () => {

    };

    const createTask = (e) => {
        let taskTitle = e.target.value;
        if (taskTitle.trim() === '') return;

        let projectTitle = _projectTitle.innerText;
        let task = Storage.addTaskToProject(taskTitle, projectTitle);
        if (task) addToTaskList(task);
        e.target.value = '';
        e.target.blur();
    };

    const addToTaskList = (task) => {
        const taskTemplate = document.querySelector('#task-template');
        let clone = taskTemplate.content.firstElementChild.cloneNode(true);
        let trash = clone.querySelector('.fa-trash-alt');
        
        trash.insertAdjacentHTML('beforeBegin', task.getTitle());
        _taskList.insertBefore(clone, _taskList.lastElementChild);

        clone.addEventListener('click', toggleTaskForm);
        trash.addEventListener('click', removeTask);
    };

    const removeTask = (e) => {
        if (e.target.classList.contains('fa-trash-alt')) {
            let task = e.target.closest('li');
            let taskTitle = task.innerText;
            let projectTitle = _projectTitle.innerText;
            let deleted = Storage.removeTaskFromProject(taskTitle, projectTitle);
            if (deleted) task.remove();
        }
    };
    
    const toggleTaskForm = (e) => {
        e.preventDefault();

        let classes = e.target.classList;
        if (classes.contains('task') || classes.contains('cancel-button')) {
            _taskForm.classList.toggle('task-form--visible');
            _wrapper.classList.toggle('wrapper--blurred');
            
            if (classes.contains('task')) {
                let projectTitle = _projectTitle.innerText;
                let taskTitle = e.target.innerText;
                let project = Storage.getProject(projectTitle);
                let task = project.getTask(taskTitle);
                if (task) populateTaskForm(task);
            }
        }
    };

    const populateTaskForm = (task) => {
        const title = _taskForm.querySelector('.task-title');
        const desc = _taskForm.querySelector('.task-desc');
        const date = _taskForm.querySelector('.task-date');
        const priorities = _taskForm.querySelectorAll('input[type=radio]');
        const done = _taskForm.querySelector('.task-done');

        title.innerText = task.getTitle();
        desc.innerText = task.getDesc();
        date.valueAsDate = task.getDate();
        Array.from(priorities)[task.getPriority()].checked = true;
        done.checked = task.isDone();
    };

    return {
        init
    };
})();

export default Display;
