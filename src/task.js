const Task = (
    id,
    title,
    desc='You can write a description here.',
    date=new Date(),
    priority=1,
    done=false) => {

    const _id = id;
    let _title = title;
    let _desc = desc;
    let _date = date;
    let _priority = priority;
    let _done = done;

    const getID = () => _id;

    const getTitle = () => _title;
    const setTitle = (title) => _title = title;

    const getDesc = () => _desc;
    const setDesc = (desc) => _desc = desc;

    const getDate = () => _date;
    const setDate = (date) => _date = date;

    const getPriority = () => _priority;
    const setPriority = (priority) => _priority = priority;

    const isDone = () => _done;
    const setDone = (done) => _done = done;

    // Information to be stored in localStorage
    const toJSON = () => {
        return {
            id: _id,
            title: _title,
            desc: _desc,
            date: _date,
            priority: _priority,
            done: _done
        }
    };

    return {
        getID,
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