// const initialState = {
//   count: 0
// };

// export default function counterReducer(state = initialState, action) {
//   switch (action.type) {
//     case 'INCREMENT':
//       return { ...state, count: state.count + 1 };
//     case 'DECREMENT':
//       return { ...state, count: state.count - 1 };
//     default:
//       return state;
//   }
// }

// const initialState = {
//   theme: 'light'
// };

// export default function theme(state=initialState,action) {
//     switch(action.type) {
//         case 'TOGGLE_THEME':
//             return {...state, theme: state.theme === 'light' ? 'dark' : 'light' };
//         default:
//             return state
//     }
// }

const initialState={
    tasks:[]
}

export default function todoList(state=initialState,action) {
    switch(action.type) {
        case 'ADD_TODO':
            return {...state, tasks:[...state.tasks, action.payload]}
        case 'DELETE_TODO' :
            return {...state, tasks:state.tasks.filter((_,i) => (i !==action.payload))}
         case 'TOGGLE_TODO':
  return {
    ...state,
    tasks: state.tasks.map((item, idx) =>
      idx === action.payload
        ? { ...item, completed: !item.completed }
        : item
    )
  };

        default:
            return state
    }
}

