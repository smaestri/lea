import React from 'react'
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";


import Home from "../home/Home";
import Header from "../home/Header";
import MyLoans from "../user/MyLoans";
import MyFriends from "../user/MyFriends";
import MyRequestedFriends from "../user/MyRequestedFriends";
import MyLendings from "../user/MyLendings";
import ListBooks from "../book/ListBooks";
import EditBook from "../user/EditBook";
import BookDetail from "../book/BookDetail";
import UserDetail from "../user/UserDetail";
import Account from "../user/Account";
import MyHistorizedLendings from "../user/MyHistorizedLendings";
import MyHistorizedLoans from "../user/MyHistorizedLoans";
import helpersLoan from '../../helpers/loan/api'
import helpersFriend from '../../helpers/friend/api'
import helpersUser from '../../helpers/user/api'
import Footer from './Footer';
import MyBooks from '../user/MyBooks';

class Layout extends React.Component {

	constructor(props) {
		super(props);
		this.checkIfConnected = this.checkIfConnected.bind(this);
		this.state = {
			nbEmprunt: 0,
			nbPret: 0,
			isNewPret: false,
			requestedFriends: [],
			currentUser: '',
			userId: '',
			isConnected: false
		};

		this.wrappedMyLoans = (props) => {
			return (
				<MyLoans
				  userId={this.state.userId}
					onRefreshCount={this.refreshCount.bind(this)}
					{...props}
				/>
			);
		}

		this.wrappedMyLendings = (props) => {
			return (
				<MyLendings
					userId={this.state.userId}
					onRefreshCount={this.refreshCount.bind(this)}
					{...props}
				/>
			);
		}

		this.wrappedMyHistLendings = (props) => {
			return (
				<MyHistorizedLendings
					userId={this.state.userId}
					onRefreshCount={this.refreshCount.bind(this)}
					{...props}
				/>
			);
		}

		this.wrappedMyHistLoans = (props) => {
			return (
				<MyHistorizedLoans
					userId={this.state.userId}
					onRefreshCount={this.refreshCount.bind(this)}
					{...props}
				/>
			);
		}

		this.wrappedListBooks = (props) => {
			return (
				<ListBooks
					userId={this.state.userId}
					{...props}
				/>
			);
		}

		this.wrappedMyBooks = (props) => {
			return (
				<MyBooks
					userId={this.state.userId}
					{...props}
				/>
			);
		}

		this.wrappedUserDetail = (props) => {
			return (
				<UserDetail
					userId={this.state.userId}
					{...props}
				/>
			);
		}

		this.wrappedEditBook = (props) => {
			return (
				<EditBook
					userId={this.state.userId}
					{...props}
				/>
			);
		}

		this.wrappedAccount = (props) => {
			return (
				<Account
					onRefreshName={this.refreshName.bind(this)}
					{...props}
				/>
			);
		}
	}

	componentDidMount() {
		this.checkIfConnected();
	}

	render() {
		return (
			<div>
				<Header
					currentUser={this.state.currentUser}
					isConnected={this.state.isConnected}
					isNewPret={this.state.isNewPret}
					requestedFriends={this.state.requestedFriends}
					refreshNotif={this.refreshNotif.bind(this)}>
				</Header>
				<Switch>
					<Route exact path="/" component={Home}></Route>
					<Route path="/my-books" component={this.wrappedMyBooks}></Route>
					<Route exact path="/edit-book" component={this.wrappedEditBook} />
					<Route exact path="/edit-book/:bookId" component={this.wrappedEditBook} />
					<Route path="/my-loans" component={this.wrappedMyLoans} />
					<Route path="/book-detail/:bookId" component={BookDetail} />
					<Route exact path="/list-book" component={this.wrappedListBooks} />
					<Route exact path="/list-book/:category" component={this.wrappedListBooks} />
					<Route path="/my-lendings" component={this.wrappedMyLendings} />
					<Route path="/my-friends" component={MyFriends} />
					<Route path="/my-requested-friends" component={MyRequestedFriends} />
					<Route path="/user-detail/:userId" component={this.wrappedUserDetail} />
					<Route path="/account" component={this.wrappedAccount} />
					<Route path="/historized-lendings" component={this.wrappedMyHistLendings} />
					<Route path="/historized-loans" component={this.wrappedMyHistLoans} />
				</Switch>
				<Footer></Footer>
			</div>
		);
	}

	checkIfConnected() {
		helpersUser.isAuthenticated().then(id => {
			this.setState({ isConnected: id != 0, userId: id })
			this.refreshCount();
			this.refreshNotif();
			this.refreshName();
		});
	}

	refreshCount() {
		if (this.state.isConnected) {
			helpersLoan.countEmpruntAndPret().then((countBean) => {
				this.setState({
					nbEmprunt: countBean.nbEmprunt,
					nbPret: countBean.nbPret
				});
			});
		}
	}

	refreshNotif() {
		if (this.state.isConnected) {
			helpersFriend.getMyRequestedFriends().then((friends) => {
				this.setState({
					requestedFriends: friends
				});
			});
			helpersLoan.isNewPret().then((isNewPret) => {
				if (isNewPret === 1) {
					this.setState({
						isNewPret: true
					});
				}
				else {
					this.setState({
						isNewPret: false
					});
				}
			});
		};
	}

	refreshName() {
		if (this.state.isConnected) {
			helpersUser.getAccount().then((user) => {
				this.setState({
					currentUser: user.firstName
				});
			});
		}
	}

}

export default Layout
