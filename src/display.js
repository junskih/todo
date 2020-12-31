// Transitioning height: https://css-tricks.com/using-css-transitions-auto-dimensions/
import Storage from '../src/storage';
import {format} from 'date-fns'

const Display = (() => {
    const _wrapper = document.querySelector('#wrapper');
    const _navHeader = document.querySelector('.nav-header');
    const _projectList = document.querySelector('#project-list');

    const _projectView = document.querySelector('#project-view');
    const _projectTitle = _projectView.querySelector('#project-title');

    const _taskList = document.querySelector('#task-list');

    const _taskForm = document.querySelector('.task-form');
    const _taskFormSaveButton = _taskForm.querySelector('.save-button');
    const _taskFormCancelButton = _taskForm.querySelector('.cancel-button');

    const init = () => {
        initListeners();
        _projectList.dataset.collapsed = false;
        let projects = Storage.getProjects();
        populateProjectList(projects);
        displayFirstProject();
    };

    const initListeners = () => {
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
        _navHeader.addEventListener('click', toggleNavList);
        _projectTitle.addEventListener('input', updateProject);
        _taskFormSaveButton.addEventListener('click', saveTaskForm);
        _taskFormCancelButton.addEventListener('click', toggleTaskForm);
    };

    const getProjectEl = (id) => {
        const projectEls = _projectList.querySelectorAll('.project')
        return Array.from(projectEls).find(project => project.dataset.projectid === id);
    };

    const getTaskEl = (id) => {
        const taskEls = _taskList.querySelectorAll('.task');
        return Array.from(taskEls).find(task => task.dataset.taskid === id);
    };

    const toggleNavList = (e) => {
        // List corresponding to header
        const header = e.target;
        const list = header.parentNode.querySelector('.nav-item-list');
        const resetHeight = () => {
            list.removeEventListener('transitionend', resetHeight);
            list.style.height = null;
        };
        const chevron = header.parentNode.querySelector('.nav-chevron');
        chevron.classList.toggle('nav-chevron--rotate');
        
        let collapsed = list.dataset.collapsed === 'true';
        let listHeight = list.scrollHeight;
        
        // Collapse list
        if (!collapsed) {
            let transition = list.transition;
            list.transition = '';

            requestAnimationFrame(() => {
                // Set height to actual height instead of auto to be able to transition properly
                list.style.height = `${listHeight}px`;
                list.transition = transition;
    
                requestAnimationFrame(() => {
                    list.style.height = `${0}px`;
                });
            });
            list.dataset.collapsed = true;

        // Expand list
        } else {
            list.style.height = `${listHeight}px`;
            list.addEventListener('transitionend', resetHeight);
            list.dataset.collapsed = false;
        }
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
    
    const populateProjectList = (projects) => {
        if (!projects) return;
        projects.forEach(project => {
            addToProjectList(project);
        });
    };

    const addToProjectList = (project) => {
        const navItemTemplate = document.querySelector('#nav-item-template');

        let clone = navItemTemplate.content.cloneNode(true);
        let item = clone.querySelector('.nav-item');
        let title = clone.querySelector('.nav-item-title');
        let trash = clone.querySelector('.fa-trash-alt');

        item.dataset.projectid = project.getID();

        title.innerText = project.getTitle();
        _projectList.insertBefore(clone, _projectList.lastElementChild);

        item.addEventListener('click', handleNavItemClick);
        trash.addEventListener('click', removeProject);
        item.classList.add('project');
    }

    const createProject = (e) => {
        let title = e.target.value;
        if (title.trim() === '') return;

        let project = Storage.addProject(title);
        if (project) {
            addToProjectList(project);
            displayProject(project);
        }

        e.target.value = '';
        e.target.blur();
    };

    const handleNavItemClick = (e) => {
        if (e.target.closest('li').classList.contains('project')) {
            let id = e.target.closest('li').dataset.projectid;
            let project = Storage.getProject(id);
            if (project) displayProject(project);
        }
    };

    const displayFirstProject = () => {
        let projects = Storage.getProjects();
        displayProject(projects[0]);
    };
    
    const displayProject = (project) => {
        _projectTitle.innerText = project.getTitle();
        _projectTitle.dataset.projectid = project.getID();
        
        // Add tasks
        clearTaskList();
        let tasks = project.getTasks();
        if (tasks) tasks.forEach(task => addToTaskList(task));
        highlightProject(project.getID());
    };

    const clearTaskList = () => {
        while (_taskList.hasChildNodes() && !_taskList.firstElementChild.classList.contains('add-task-item')) {
            _taskList.firstElementChild.remove();
        }
    };

    const highlightProject = (id) => {
        const highlightedClass = 'nav-item--highlighted';
        const projectEl = getProjectEl(id);

        let titles = Array.from(_projectList.querySelectorAll('.nav-item-title'));
        let highlighted = titles.find(title => title.classList.contains(highlightedClass));
        if (highlighted) highlighted.classList.remove(highlightedClass);
        projectEl.querySelector('.nav-item-title').classList.add(highlightedClass);
    };
    
    const removeProject = (e) => {
        if (e.target.classList.contains('fa-trash-alt')) {
            let id = e.target.closest('li').dataset.projectid;
            Storage.removeProject(id);
            e.target.parentNode.remove();

            if (id === _projectTitle.dataset.projectid) {
                displayFirstProject(); // show "adjacent" project instead?
            }
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
        const clone = taskTemplate.content.firstElementChild.cloneNode(true);
        const done = clone.querySelector('.task-done');
        const title = clone.querySelector('.task-title');
        const desc =  clone.querySelector('.task-desc');
        const date = clone.querySelector('.task-date');
        const trash = clone.querySelector('.fa-trash-alt');

        clone.dataset.taskid = task.getID();

        done.checked = task.isDone();
        title.innerText = task.getTitle();
        desc.innerText = task.getDesc();
        date.innerText = format(task.getDate(), 'do MMM yyyy');
        _taskList.insertBefore(clone, _taskList.lastElementChild);

        clone.addEventListener('click', displayTask);
        done.addEventListener('change', setTaskDone);
        trash.addEventListener('click', removeTask);

        setTaskStyles(clone, task);
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

    const displayTask = (e) => {
        if (e.currentTarget.classList.contains('task') &&
            !e.target.classList.contains('fa-trash-alt') &&
            !e.target.classList.contains('task-done')) {
            let projectID = _projectTitle.dataset.projectid;
            let taskID = e.currentTarget.dataset.taskid;

            let project = Storage.getProject(projectID);
            let task = project.getTask(taskID);
            if (!task) return;

            populateTaskForm(task);
            toggleTaskForm();
        }
    };
    
    const toggleTaskForm = (e) => {
        e?.preventDefault();
        _taskForm.classList.toggle('task-form--visible');
        _wrapper.classList.toggle('wrapper--blurred');
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

        _taskForm.dataset.taskid = task.getID();
    };

    const saveTaskForm = (e) => {
        e.preventDefault();
        let projectID = _projectTitle.dataset.projectid;
        let taskID = _taskForm.dataset.taskid;

        // Get new properties
        let title = _taskForm.querySelector('.task-form-title').innerText;
        let desc = _taskForm.querySelector('.task-form-desc').innerText;
        let date = _taskForm.querySelector('.task-form-date').valueAsDate;
        let priorities = Array.from(_taskForm.querySelectorAll('input[type=radio]'));
        let priority = priorities.indexOf(priorities.find(priority => priority.checked));
        let done = _taskForm.querySelector('.task-form-done').checked;

        updateTask({ projectID, taskID, title, desc, date, priority, done});
        toggleTaskForm();
    };

    const updateTask = ({ projectID, taskID, title, desc, date, priority, done }) => {
        // Set new properties
        let task = Storage.updateTask({ projectID, taskID, title, desc, date, priority, done });
        
        // Update task element
        let taskEl = getTaskEl(taskID);
        let taskTitle = taskEl.querySelector('.task-title');
        let taskDone = taskEl.querySelector('.task-done');
        let taskDoneChanged = taskDone.checked !== task.isDone();
        let taskDesc = taskEl.querySelector('.task-desc');
        let taskDate = taskEl.querySelector('.task-date');
        taskTitle.innerText = task.getTitle();
        taskDone.checked = task.isDone();
        taskDesc.innerText = task.getDesc();
        taskDate.innerText = format(task.getDate(), 'do MMM yyyy');

        setTaskStyles(taskEl, task);
    };

    const setTaskStyles = (taskEl, task) => {
        const lowClass = 'task--priority-low';
        const normalClass = 'task--priority-normal';
        const highClass = 'task--priority-high';

        let classes = taskEl.classList;
        if (task.isDone()) {
            classes.add('task--completed');
        } else {
            classes.remove('task--completed');
        }

        if (classes.contains(lowClass)) classes.remove(lowClass);
        if (classes.contains(normalClass)) classes.remove(normalClass);
        if (classes.contains(highClass)) classes.remove(highClass);
        
        switch (task.getPriority()) {
            case 0:
                classes.add(lowClass);
                break;

            case 1:
                classes.add(normalClass);
                break;

            case 2:
                classes.add(highClass);
                break;

            default:
                break;
        }
    };

    const setTaskDone = (e) => {
        if (e.target.classList.contains('task-done')) {
            let projectID = _projectTitle.dataset.projectid;
            let task = e.target.closest('.task');
            let taskID = task.dataset.taskid;
            let done = e.target.checked;
            updateTask({ projectID, taskID, done });
        }
    };

    const updateProject = (e) => {
        let projectID = _projectTitle.dataset.projectid;
        let newTitle = _projectTitle.innerText;
        let project = Storage.updateProject({
            projectID: projectID,
            title: newTitle
        });
    
        let projectEl = getProjectEl(projectID);
        projectEl.querySelector('.nav-item-title').innerText = project.getTitle();
    };

    return {
        init
    };
})();

export default Display;
