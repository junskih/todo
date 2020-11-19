import Storage from '../src/storage';

const Display = (() => {
    const _wrapper = document.querySelector('#wrapper');
    const _sidebar = document.querySelector('#sidebar');
    const _sidebarHeader = document.querySelector('.sidebar-header');
    const _projectView = document.querySelector('#project-view');
    const _addProjectText = document.querySelector('#add-project-text');
    const _addProjectInput = document.querySelector('#add-project-input');

    const init = () => {
        _addProjectText.addEventListener('click', toggleAddProjectInput);
        _addProjectInput.addEventListener('focusout', toggleAddProjectInput);
        _addProjectInput.addEventListener('change', addProject);
    };

    const populateProjectList = () => {
        let projects = Storage.getProjects();
        _sidebarHeader.addEventListener('click', toggleProjectList);

        if (!projects) return;
        projects.forEach(project => {
            addToProjectList(project);
        });
    };

    const addToProjectList = (project) => {
        const sidebarItemTemplate = document.querySelector('#sidebar-item-template');
        const projectList = _sidebarHeader.querySelector('ul');

        let clone = sidebarItemTemplate.content.cloneNode(true);
        let item = clone.querySelector('li');

        item.textContent = project.getTitle();
        projectList.insertBefore(item, projectList.lastElementChild);

        item.addEventListener('click', showProject);
    }

    const toggleProjectList = (e) => {
        if (!e.target.classList.contains('sidebar-header')) return;

        let items = document.querySelectorAll('li');
        let chevron = _sidebarHeader.querySelector('i');

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

    const addProject = (e) => {
        let title = e.target.value;
        if (title.trim() === '') return;

        let project = Storage.addProject(title);
        addToProjectList(project);
    };

    const showProject = (e) => {
        if (!e?.target?.textContent) return;

        const todoContainer = document.querySelector('#todo-container');
        const todoTemplate = document.querySelector('#todo-template');
        let projects = Storage.getProjects();
        
        while (todoContainer.hasChildNodes()) {
            todoContainer.firstChild.remove();
        }

        let project = projects.filter(project => project.title === e.target.textContent)[0];
        
        let projectTitle = _projectView.querySelector('.project-title');
        projectTitle.textContent = project.title;

        project.todos.forEach(todo => {
            let clone = todoTemplate.content.firstElementChild.cloneNode(true);
            clone.insertAdjacentHTML('beforeEnd', todo.title);
            clone.classList.add('todo');
            clone.addEventListener('click', showTodo);
            todoContainer.appendChild(clone);
        });
    };

    const showTodo = (e) => {
        console.log(e?.target);
    };

    return {
        init,
        populateProjectList
    };
})();

export default Display;