import React from 'react';
import ReactDOM from 'react-dom';
//import todoReducer from './reducers/todo'
//import { createStore } from 'redux'
import { Router, Route, hashHistory } from 'react-router'
import Home from "./components/Home";
import MyBooks from "./components/MyBooks";
import MyLoans from "./components/MyLoans";
import MyLendings from "./components/MyLendings";
import ListBooks from "./components/ListBooks";
import EditBook from "./components/EditBook";

//const store = createStore(todoReducer)

const render =() => {
    ReactDOM.render(
        <Router history={hashHistory}>
            <Route path="/" component={Home}>
                <Route path="/my-books" component={MyBooks }/>
                <Route path="/edit-book" component={EditBook }/>
                <Route path="/edit-book/:bookId" component={EditBook }/>
                <Route path="/my-loans" component={MyLoans}/>
                <Route path="/list-book" component={ListBooks}/>
                <Route path="/my-lendings" component={MyLendings}/>
            </Route>
        </Router>,
        document.getElementById('app'));
}

render();
// store.subscribe(render);
