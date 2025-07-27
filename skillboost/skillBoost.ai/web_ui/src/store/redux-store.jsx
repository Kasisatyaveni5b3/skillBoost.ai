import { configureStore } from '@reduxjs/toolkit';
import todoList from './reducers';

const store = configureStore({
  reducer: {
    todo:todoList
  }
});

export default store;