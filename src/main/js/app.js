import React from 'react';
import ReactDOM from 'react-dom';
import Container from './components/Container';
import todoReducer from './reducers/todo'
import { createStore } from 'redux'

const store = createStore(todoReducer)

const render =() => {
       ReactDOM.render(<Container store={store} />, document.getElementById('app'));
}

render();
store.subscribe(render);
