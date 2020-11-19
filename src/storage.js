import Project from '../src/project';

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
        console.log(_projects)
        return _projects;
    };

    const saveToLocalStorage = () => {
        console.log(_projects)
        localStorage.setItem(_storageItemName, JSON.stringify(_projects));
    };

    const loadFromLocalStorage = () => {
        let projects = JSON.parse(localStorage.getItem(_storageItemName));
        if (!projects || Object.keys(projects[0]).length === 0 && projects[0].constructor === Object) return;
        _projects = projects;
    };

    return {
        addProject,
        getProjects,
        saveToLocalStorage,
        loadFromLocalStorage
    };
})();

export default Storage;