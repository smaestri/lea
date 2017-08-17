import React from 'react';
import { Router, Route, hashHistory } from 'react-router'
import { render } from 'react-dom';
import Header from "./components/home/Header";
import Home from "./components/home/Home";
import MyBooks from "./components/user/MyBooks";
import MyLoans from "./components/user/MyLoans";
import MyFriends from "./components/user/MyFriends";
import MyRequestedFriends from "./components/user/MyRequestedFriends";
import MyLendings from "./components/user/MyLendings";
import ListBooks from "./components/book/ListBooks";
import EditBook from "./components/user/EditBook";
import LoanDetail from "./components/loan/LoanDetail";
import BookDetail from "./components/book/BookDetail";
import UserDetail from "./components/user/UserDetail";
import Account from "./components/user/Account";
import MyHistorizedLendings from "./components/user/MyHistorizedLendings";
import MyHistorizedLoans from "./components/user/MyHistorizedLoans";

class App extends React.Component {

	render() {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={Header}>
					<Route path="/home" component={Home}/>
					<Route path="/my-books" component={MyBooks}/>
					<Route path="/edit-book" component={EditBook}/>
					<Route path="/edit-book/:bookId" component={EditBook}/>
					<Route path="/my-loans" component={MyLoans}/>
					<Route path="/loan-detail/:loanId/:isLending" component={LoanDetail}/>
					<Route path="/book-detail/:bookId/:previousPage" component={BookDetail}/>
					<Route path="/list-book" component={ListBooks}/>
					<Route path="/my-lendings" component={MyLendings}/>
					<Route path="/my-friends" component={MyFriends}/>
					<Route path="/my-requested-friends" component={MyRequestedFriends}/>
					<Route path="/user-detail/:userId/:previousPage" component={UserDetail}/>
					<Route path="/account" component={Account}/>
					<Route path="/historized-lendings" component={MyHistorizedLendings}/>
					<Route path="/historized-loans" component={MyHistorizedLoans}/>
				</Route>
			</Router>)
	}
}

export default App;

render(<App/>, document.getElementById('app'));
