import Project from '../src/project';
import Task from '../src/task';
import parseJSON from 'date-fns/parseJSON';
import {v4 as uuidv4} from 'uuid';

const Storage = (() => {
    let _storageItemName = 'projects';
    let _projects = [];

    const addProject = (title) => {
        let project = Project(uuidv4(), title);
        _projects.push(project);
        saveToLocalStorage();
        return project;
    };

    const getProjects = () => {
        if (Array.isArray(_projects) && _projects.length === 0) {
            loadFromLocalStorage();
        }
        return _projects;
    };

    const getProject = (id) => _projects.find(project => project.getID() === id);

    const removeProject = (id) => {
        let index = _projects.indexOf(_projects.find(project => project.getID() === id));
        if (index === undefined) return false;
        _projects.splice(index, 1);
        saveToLocalStorage();
    };

    const addTaskToProject = (taskTitle, projectID) => {
        let project = getProject(projectID);
        let task = Task(uuidv4(), taskTitle);
        project.addTask(task);
        saveToLocalStorage();
        return task;
    };

    const removeTaskFromProject = (taskID, projectID) => {
        let project = getProject(projectID);
        project.removeTask(taskID);
        saveToLocalStorage();
    };

    const updateTask = (projectID, taskID, title, desc, date, priority, done) => {
        let project = getProject(projectID);
        let task = project.getTask(taskID);
        task.setTitle(title);
        task.setDesc(desc);
        task.setDate(date);
        task.setPriority(priority);
        task.setDone(done);
        saveToLocalStorage();
        return task;
    };

    const saveToLocalStorage = () => {
        localStorage.setItem(_storageItemName, JSON.stringify(_projects));
    };

    const loadFromLocalStorage = () => {
        let projects = JSON.parse(localStorage.getItem(_storageItemName));
        
        // Construct objects from stored data
        projects.forEach(project => {
            let newProject = Project(project.id, project.title);
            _projects.push(newProject);

            project.tasks.forEach(task => {
                let id = task.id;
                let title = task.title;
                let desc = task.desc;
                let date = parseJSON(task.date);
                let priority = task.priority;
                let done = task.done;

                let newTask = Task(id, title, desc, date, priority, done);
                newProject.addTask(newTask);
            });
        });
    };

    return {
        addProject,
        getProjects,
        getProject,
        removeProject,
        addTaskToProject,
        removeTaskFromProject,
        updateTask
    };
})();

export default Storage;