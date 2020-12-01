import Project from '../src/project';
import Task from '../src/task';

const Storage = (() => {
    let _storageItemName = 'projects';
    let _projects = [];

    const addProject = (title) => {
        let project = Project(title);
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

    const getProject = (title) => {
        return _projects.find(project => project.getTitle() === title);
    };

    const removeProject = (index) => {
        _projects.splice(index, 1);
    };

    const addTaskToProject = (taskTitle, projectTitle) => {
        let project = _projects.find(project => projectTitle === project.getTitle());
        let task = Task(taskTitle);
        project.addTask(task);

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
            let newProject = Project(project.title);
            _projects.push(newProject);

            project.tasks.forEach(task => {
                let newTask = Task(task.title);
                newProject.addTask(newTask);
            });
        });

        /*
        if (!projects || Object.keys(projects[0]).length === 0 && projects[0].constructor === Object) return;
        _projects = projects;
        */
    };

    return {
        addProject,
        getProjects,
        getProject,
        removeProject,
        addTaskToProject
    };
})();

export default Storage;