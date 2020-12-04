import Storage from '../src/storage';

const Display = (() => {
    const _navHeader = document.querySelector('.nav-header');
    const _projectView = document.querySelector('#project-view');
    const _labelToggles = document.querySelectorAll('.label-toggle');
    const _inputToggles = document.querySelectorAll('.input-toggle');
    const _taskList = document.querySelector('#task-list');
    const _projectTitle = _projectView.querySelector('#project-title');

    const init = () => {
        // Add event listeners for 
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
            item.classList.toggle('expanded');
        });
        chevron.classList.toggle('rotate');
    };

    const toggleLabelInput = (e) => {
        let target = e.target;
        let classes = target.classList;

        if (classes.contains('label-toggle')) {
            classes.toggle('hide');
            let input = target.nextElementSibling;
            if (input.classList.toggle('show')) input.focus();
        }

        if (classes.contains('input-toggle')) {
            classes.toggle('show');
            let label = target.previousElementSibling;
            label.classList.toggle('hide');
        }
    };

    const createProject = (e) => {
        let title = e.target.value;
        if (title.trim() === '') return;

        let project = Storage.addProject(title);
        addToProjectList(project);
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

    const createTask = (e) => {
        let taskTitle = e.target.value;
        if (taskTitle.trim() === '') return;

        let projectTitle = _projectTitle.innerText;
        let task = Storage.addTaskToProject(taskTitle, projectTitle);
        addToTaskList(task);
    };

    const addToTaskList = (task) => {
        const taskTemplate = document.querySelector('#task-template');
        let clone = taskTemplate.content.firstElementChild.cloneNode(true);
        let trash = clone.querySelector('.fa-trash-alt');
        
        trash.insertAdjacentHTML('beforeBegin', task.getTitle());
        _taskList.insertBefore(clone, _taskList.lastElementChild);

        clone.addEventListener('click', showTask);
        trash.addEventListener('click', removeTask);
    };
    
    const showTask = (e) => {
        if (e.target.classList.contains('task')) {
            console.log(`showtask: ${e.target}`);
        }
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

    return {
        init
    };
})();

export default Display;