import Project from '../src/project';

const Storage = (() => {
    let _storageItemName = 'projects';
    let _projects = [];

    const addProject = (title) => {
        let project = Project(title);
        _projects.push(project);
        return project;
    };

    const getProjects = () => {
        if (Array.isArray(_projects) && _projects.length !== 0) {
            return _projects;
        }
    };

    const saveToLocalStorage = () => {
        localStorage.setItem(_storageItemName, JSON.stringify(_projects));
    };

    const loadFromLocalStorage = () => {
        let projects = localStorage.getItem(_storageItemName);
        if (!projects) return;
        _projects = JSON.parse(projects);
    };

    return {
        addProject,
        getProjects,
        saveToLocalStorage,
        loadFromLocalStorage
    };
})();

export default Storage;