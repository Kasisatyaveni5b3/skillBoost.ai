export const increment = () => ({type:'INCREMENT'});
export const decrement = () => ({type:'DECREMENT'})

export const toggleTheme  = () => ({type:'TOGGLE_THEME'});

export const addTodo=(task) => ({
  type:'ADD_TODO',
  payload:task
})

export const deleteTodo = (index) => ({
    type:'DELETE_TODO',
    payload:index
})
export const toggleTodo = (task) => ({
    type:'TOGGLE_TODO',
    payload:task
})


