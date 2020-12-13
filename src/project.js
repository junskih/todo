const Project = (title) => {
    let _title = title;
    let _tasks = [];
    
    const getTitle = () => _title;
    const setTitle = (title) => _title = title;

    const getTask = (taskTitle) => _tasks.find(task => task.getTitle() === taskTitle);
    const getTasks = () => _tasks;
    const addTask = (task) => _tasks.push(task);
    const removeTask = (taskTitle) => _tasks.splice(_tasks.indexOf(getTask(taskTitle)), 1);

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
        getTask,
        getTasks,
        addTask,
        removeTask,
        toJSON
    };
};

export default Project;