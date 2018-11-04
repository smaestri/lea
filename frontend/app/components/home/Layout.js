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
import Notification from "./Notification";
import Account from "../user/Account";
import MyHistorizedLendings from "../user/MyHistorizedLendings";
import MyHistorizedLoans from "../user/MyHistorizedLoans";
import helpersLoan from '../../helpers/loan/api'
import helpersFriend from '../../helpers/friend/api'
import helpersUser from '../../helpers/user/api'
import Footer from './Footer';
import MyBooks from '../user/MyBooks';
import Login from '../login/Login'
import Subscribe from '../subscribe/Subscribe'
import helpers from '../../helpers/user/api';

class Layout extends React.Component {

	constructor(props) {
		super(props);
		this.refreshUserConnected = this.refreshUserConnected.bind(this);
		this.logout = this.logout.bind(this);
		this.state = {
			nbEmprunt: 0,
			nbPret: 0,
			isNewPret: false,
			requestedFriends: [],
			currentUser: '',
			userId: '',
			isConnected: false,
			redirectToLogin: false
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
					isCreation={false}
					refreshUserConnected={this.refreshUserConnected}
					{...props}
				/>
			);
		}

		this.wrappedSubscribe = (props) => {
			return (
				<Account
					isCreation={true}
					refreshUserConnected={this.refreshUserConnected}
					{...props}
				/>
			);
		}

		this.wrappedLogin= (props) => {
			return (
				<Login
					refreshUserConnected={this.refreshUserConnected.bind(this)}
					{...props}
				/>
			);
		}
	}

	componentDidMount() {
		this.refreshUserConnected();
	}

	render() {

		let notifications = "";
		if (this.state.isConnected) {
			notifications = (
				<Notification
					isNewPret={this.state.isNewPret}
					requestedFriends={this.state.requestedFriends}
					onRefreshNotification={this.refreshNotif} />);
		}

		return (
			<div className="main-content">
				<Header
					currentUser={this.state.currentUser}
					isConnected={this.state.isConnected}
					redirectToLogin={this.state.redirectToLogin}
					nbPret={this.state.nbPret}
					nbEmprunt={this.state.nbEmprunt}
					logout={this.logout}>
				</Header>
				{notifications}
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
					<Route path="/login" component={this.wrappedLogin} />
					<Route path="/subscribe" component={this.wrappedSubscribe} />
				</Switch>
				<Footer></Footer>
			</div>
		);
	}

	refreshUserConnected() {
		helpersUser.isAuthenticated().then(id => {
			this.setState({ isConnected: id != 0, userId: id, redirectToLogin: false})
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

	logout() {
		this.setState({
			redirectToLogin: true
		});
		helpers.logout().then(() => {
			this.refreshUserConnected();
		})
	}

	

}

export default Layout
