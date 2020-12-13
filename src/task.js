const Task = (
    title,
    desc='You can write a description here.',
    dueDate=new Date(),
    priority=2,
    done=false) => {

    let _title = title;
    let _desc = desc;
    let _dueDate = dueDate;
    let _priority = priority;
    let _done = done;

    const getTitle = () => _title;
    const setTitle = (title) => _title = title;

    const getDesc = () => _desc;
    const setDesc = (desc) => _desc = desc;

    const getDate = () => _dueDate;
    const setDate = (dueDate) => _dueDate = dueDate;

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
            priority: _priority,
            done: _done
        }
    };

    return {
        getTitle,
        setTitle,
        getDesc,
        setDesc,
        getDate,
        setDate,
        getPriority,
        setPriority,
        isDone,
        setDone,
        toJSON
    }
};

export default Task;