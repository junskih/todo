const Project = (title) => {
    let _title = title;
    let _tasks = [];
    
    const getTitle = () => _title;
    const setTitle = (title) => _title = title;

    const getTasks = () => _tasks;
    const addTask = (task) => _tasks.push(task);
    const removeTask = (index) => _tasks.splice(index, 1);

    // Information to be stored in localStorage
    const toJSON = () => {
        return {
            title: _title,
            tasks: _tasks
        }
    };

    return {
        getTitle,
        setTitle,
        getTasks,
        addTask,
        removeTask,
        toJSON
    };
};

export default Project;