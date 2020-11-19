const Project = (title) => {
    let _title = title;
    let _todos = [];
    
    const getTitle = () => _title;
    const setTitle = (title) => _title = title;

    const getTodos = () => _todos;
    const addTodo = (todo) => _todos.push(todo);

    const removeTodo = (index) => _todos.splice(index, 1);

    return {
        getTitle,
        setTitle,
        getTodos,
        addTodo,
        removeTodo
    };
};

export default Project;