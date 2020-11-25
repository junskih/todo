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
        return _projects;
    };

    const getProject = (title) => {
        return _projects.filter(project => project.getTitle() === title)[0];
    };

    const saveToLocalStorage = () => {
        localStorage.setItem(_storageItemName, JSON.stringify(_projects));
    };

    const loadFromLocalStorage = () => {
        let projects = JSON.parse(localStorage.getItem(_storageItemName));
        
        // Construct objects from stored data
        projects.forEach(project => {
            _projects.push(Project(project.title));
        });

        /*
        if (!projects || Object.keys(projects[0]).length === 0 && projects[0].constructor === Object) return;
        _projects = projects;
        */
    };

    return {
        addProject,
        getProjects,
        getProject
    };
})();

export default Storage;