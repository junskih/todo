const Todo = ({title, desc, dueDate, priority}) => {
    let _title = title;
    let _desc = desc;
    let _dueDate = dueDate;
    let _priority = priority;

    const getTitle = () => _title;
    const setTitle = (title) => _title = title;

    const getDesc = () => _desc;
    const setDesc = (desc) => _desc = desc;

    const getDueDate = () => _dueDate;
    const setDueDate = (dueDate) => _dueDate = dueDate;

    const getPriority = () => _priority;
    const setPriority = (priority) => _priority = priority;

    return {
        getTitle,
        setTitle,
        getDesc,
        setDesc,
        getDueDate,
        setDueDate,
        getPriority,
        setPriority
    }
};

export default Todo;