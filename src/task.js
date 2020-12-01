const Task = (title, desc='This is a task', dueDate='Now', priority='High', done=false) => {
    let _title = title;
    let _desc = desc;
    let _dueDate = dueDate;
    let _priority = priority;
    let _done = done;

    const getTitle = () => _title;
    const setTitle = (title) => _title = title;

    const getDesc = () => _desc;
    const setDesc = (desc) => _desc = desc;

    const getDueDate = () => _dueDate;
    const setDueDate = (dueDate) => _dueDate = dueDate;

    const getPriority = () => _priority;
    const setPriority = (priority) => _priority = priority;

    const isDone = () => _done;
    const setDone = (done) => _done = done;

    // Information to be stored in localStorage
    const toJSON = () => {
        return {
            title: _title,
            desc: _desc,
            dueDate: _dueDate,
            priority: _priority
        }
    };

    return {
        getTitle,
        setTitle,
        getDesc,
        setDesc,
        getDueDate,
        setDueDate,
        getPriority,
        setPriority,
        isDone,
        setDone,
        toJSON
    }
};

export default Task;