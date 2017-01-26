import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import Home from "./components/Home";
import MyBooks from "./components/MyBooks";
import MyLoans from "./components/MyLoans";
import MyFriends from "./components/MyFriends";
import MyRequestedFriends from "./components/MyRequestedFriends";
import MyLendings from "./components/MyLendings";
import ListBooks from "./components/ListBooks";
import EditBook from "./components/EditBook";
import LoanDetail from "./components/LoanDetail";
import BookDetail from "./components/BookDetail";
import UserDetail from "./components/UserDetail";

//const store = createStore(todoReducer)

const render =() => {
    ReactDOM.render(
        <Router history={hashHistory}>
            <Route path="/" component={Home}>
                <Route path="/my-books" component={MyBooks }/>
                <Route path="/edit-book" component={EditBook }/>
                <Route path="/edit-book/:bookId" component={EditBook }/>
                <Route path="/my-loans" component={MyLoans}/>
                <Route path="/loan-detail/:loanId/:isLending" component={LoanDetail}/>
                <Route path="/book-detail/:bookId" component={BookDetail}/>
                <Route path="/list-book" component={ListBooks}/>
                <Route path="/my-lendings" component={MyLendings}/>
                <Route path="/my-friends" component={MyFriends}/>
                <Route path="/my-requested-friends" component={MyRequestedFriends}/>
                <Route path="/user-detail/:userId" component={UserDetail}/>
            </Route>
        </Router>,
        document.getElementById('app'));
}

render();
// store.subscribe(render);
