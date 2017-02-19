let nextTodoId = 0;
export const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  }
};;
export const deleteTodo = (id) => {
  return {
    type: 'DELETE_TODO',
    id: id
  };
};

