const Project = (id, title) => {
    const _id = id;
    let _title = title;
    let _tasks = [];

    const getID = () => _id;
    
    const getTitle = () => _title;
    const setTitle = (title) => _title = title;

    const getTask = (id) => _tasks.find(task => task.getID() === id);
    const getTasks = () => _tasks;
    const addTask = (task) => _tasks.push(task);
    const removeTask = (id) => _tasks.splice(_tasks.indexOf(getTask(id)), 1);

    // Information to be stored in localStorage
    const toJSON = () => {
        return {
            id: _id,
            title: _title,
            tasks: _tasks
        }
    };

    return {
        getID,
        getTitle,
        setTitle,
        getTask,
        getTasks,
        addTask,
        removeTask,
        toJSON
    };
};

export default Project;