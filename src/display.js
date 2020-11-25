import Storage from '../src/storage';

const Display = (() => {
    const _navHeader = document.querySelector('.nav-header');
    const _projectView = document.querySelector('#project-view');
    const _addProjectText = document.querySelector('#add-project-text');
    const _addProjectInput = document.querySelector('#add-project-input');
    const _taskContainer = document.querySelector('#task-container');

    const init = () => {
        _addProjectText.addEventListener('click', toggleAddProjectInput);
        _addProjectInput.addEventListener('focusout', toggleAddProjectInput);
        _addProjectInput.addEventListener('change', createProject);
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

    const toggleAddProjectInput = (e) => {
        _addProjectText.classList.toggle('hide')
        if (_addProjectInput.classList.toggle('show')) {
            _addProjectInput.focus();
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
        while (_taskContainer.hasChildNodes()) _taskContainer.firstChild.remove();
        
        let projectTitle = _projectView.querySelector('.project-title');
        projectTitle.textContent = project.getTitle();
        
        let tasks = project.getTasks();

        if (tasks) {
            tasks.forEach(task => {
                addToTaskList(task);
            });
        }
    };

    const addToTaskList = (task) => {
        const taskTemplate = document.querySelector('#task-template');
        let clone = taskTemplate.content.firstElementChild.cloneNode(true);

        clone.insertAdjacentHTML('beforeEnd', task.getTitle());
        clone.classList.add('task');
        clone.addEventListener('click', showtask);
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