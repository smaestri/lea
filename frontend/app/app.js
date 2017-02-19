import React from 'react';
import {Router, Route, hashHistory} from 'react-router'
import {render} from 'react-dom';
import Home from "./components/Home";
import Main from "./components/Main";
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
import Account from "./components/Account";
import MyHistorizedLendings from "./components/MyHistorizedLendings";
import MyHistorizedLoans from "./components/MyHistorizedLoans";
import {Tests} from "./components/Test";
import '../assets/css/common.scss';

class App extends React.Component {

    render() {
        return(
            <Router history={hashHistory}>
                <Route path="/" component={Home}>
                    <Route path="/home" component={Main}/>
                    <Route path="/my-books" component={MyBooks}/>
                    <Route path="/edit-book" component={EditBook}/>
                    <Route path="/edit-book/:bookId" component={EditBook}/>
                    <Route path="/my-loans" component={MyLoans}/>
                    <Route path="/loan-detail/:loanId/:isLending" component={LoanDetail}/>
                    <Route path="/book-detail/:bookId/:previousPage" component={BookDetail}/>
                    <Route path="/list-book" component={ListBooks}/>
                    <Route path="/my-lendings" component={MyLendings} />
                    <Route path="/my-friends" component={MyFriends}/>
                    <Route path="/my-requested-friends" component={MyRequestedFriends}/>
                    <Route path="/user-detail/:userId/:previousPage" component={UserDetail}/>
                    <Route path="/account" component={Account}/>
                    <Route path="/historized-lendings" component={MyHistorizedLendings}/>
                    <Route path="/historized-loans" component={MyHistorizedLoans}/>
                    <Route path="/test" component={Tests}/>
                </Route>
            </Router>)
    }
}

export default App;

render(<App/>, document.getElementById('app'));
