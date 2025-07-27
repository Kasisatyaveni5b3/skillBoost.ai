import { useDispatch, useSelector } from "react-redux";
import { addTodo,deleteTodo,toggleTodo } from "../store/actions";
import { useState } from "react";

export default function App() {
  const [input, setInput] = useState('');
  const addItem = useSelector((state) => state.todo.tasks);
  const dispatch = useDispatch();

  return (
    <div>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => dispatch(addTodo(input))}>Add</button>
      <ul>
        {addItem.map((item, index) => (
  <li key={index}>
    <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
      {item.text}
    </span>
    
    <input
      type="checkbox"
      checked={item.completed}
      onChange={() => dispatch(toggleTodo(index))}
    />
    
    <button onClick={() => dispatch(deleteTodo(index))}>
      Delete
    </button>
  </li>
))}

      </ul>
    </div>
  );
}
