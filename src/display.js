import Storage from '../src/storage';

const Display = (() => {
    const _navHeader = document.querySelector('.nav-header');
    const _projectView = document.querySelector('#project-view');
    const _labelToggles = document.querySelectorAll('.label-toggle');
    const _inputToggles = document.querySelectorAll('.input-toggle');
    const _taskContainer = document.querySelector('#task-list');

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

        populateProjectList();
    };

    const populateProjectList = () => {
        let projects = Storage.getProjects();
        _navHeader.addEventListener('click', toggleProjectList);
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

        item.textContent = project.getTitle();
        projectList.insertBefore(item, projectList.lastElementChild);

        item.addEventListener('click', showProject);
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

            if (input.classList.toggle('show')) {
                input.focus();
            }
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
        if (!e?.target?.textContent) return;

        let project = Storage.getProject(e.target.textContent);
        if (!project) return;
        
        // Empty task list
        while (_taskContainer.hasChildNodes() && _taskContainer.firstChild.id !== 'add-task-item') {
            _taskContainer.firstChild.remove();
        }
        
        let projectTitle = _projectView.querySelector('.project-title');
        projectTitle.textContent = project.getTitle();
        
        let tasks = project.getTasks();

        if (tasks) {
            tasks.forEach(task => {
                addToTaskList(task);
            });
        }
    };

    const createTask = (e) => {
        let taskTitle = e.target.value;
        if (taskTitle.trim() === '') return;

        let projectTitle = _projectView.querySelector('.project-title').textContent;
        let task = Storage.addTaskToProject(taskTitle, projectTitle);
        //addToTaskList(task);
    };

    const addToTaskList = (task) => {
        const taskTemplate = document.querySelector('#task-template');
        let clone = taskTemplate.content.firstElementChild.cloneNode(true);

        clone.insertAdjacentHTML('beforeEnd', task.getTitle());
        clone.classList.add('task');
        clone.addEventListener('click', showTask);
        _taskContainer.appendChild(clone);
    };
    
    const showTask = (e) => {
        console.log(e?.target);
    };

    return {
        init
    };
})();

export default Display;