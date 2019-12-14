import React from 'react'
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import Home from "../home/Home";
import Header from "../home/Header";
import CommentMarche from "../home/footer/CommentMarche";
import Contact from "../home/footer/Contact";
import Faq from "../home/footer/Faq";
import InformationsLegales from "../home/footer/InformationsLegales";
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
import Footer from './footer/Footer';
import MyBooks from '../user/MyBooks';
import Login from '../login/Login'
import helpers from '../../helpers/user/api';

class Layout extends React.Component {

	constructor(props) {
		super(props);
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
					onRefreshNotif={this.refreshNotif.bind(this)}
					{...props}
				/>
			);
		}

		this.wrappedMyLendings = (props) => {
			return (
				<MyLendings
					userId={this.state.userId}
					onRefreshCount={this.refreshCount.bind(this)}
					onRefreshNotif={this.refreshNotif.bind(this)}
					{...props}
				/>
			);
		}

		this.wrappedMyHistLendings = (props) => {
			return (
				<MyHistorizedLendings
					userId={this.state.userId}
					{...props}
				/>
			);
		}

		this.wrappedMyHistLoans = (props) => {
			return (
				<MyHistorizedLoans
					userId={this.state.userId}
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
					refreshUserConnected={this.refreshUserConnected.bind(this)}
					{...props}
				/>
			);
		}

		this.wrappedSubscribe = (props) => {
			return (
				<Account
					isCreation={true}
					refreshUserConnected={this.refreshUserConnected.bind(this)}
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

		this.wrappedMyFriends = () => {
			return (
				<MyFriends
					onRefreshNotification={this.refreshNotif.bind(this)}
					{...props}
				/>
			);
		}

		this.wrappedRequestedFriends = () => {

			return (
				<MyRequestedFriends
					onRefreshNotification={this.refreshNotif.bind(this)}
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
    [			
				<Header
					currentUser={this.state.currentUser}
					isConnected={this.state.isConnected}
					redirectToLogin={this.state.redirectToLogin}
					nbPret={this.state.nbPret}
					nbEmprunt={this.state.nbEmprunt}
					logout={this.logout.bind(this)}>
				</Header>
        ,
        // {notifications}
        ,
				<Switch>
					<Route exact path="/" component={Home}></Route>
					<Route path="/my-books" component={this.wrappedMyBooks}></Route>
					<Route exact path="/edit-book" component={this.wrappedEditBook} />
					<Route exact path="/edit-book/:bookId" component={this.wrappedEditBook} />
					<Route path="/my-loans" component={this.wrappedMyLoans} />
					<Route path="/book-detail/:bookId" component={BookDetail} />
					<Route exact path="/list-book" component={this.wrappedListBooks} />
					<Route exact path="/list-book-by-category/:category" component={this.wrappedListBooks} />
					<Route exact path="/list-book-by-term/:search" component={this.wrappedListBooks} />
					<Route path="/my-lendings" component={this.wrappedMyLendings} />
					<Route path="/my-friends" component={this.wrappedMyFriends} />
					<Route path="/my-requested-friends" component={this.wrappedRequestedFriends} />
					<Route path="/user-detail/:userId" component={this.wrappedUserDetail} />
					<Route path="/account" component={this.wrappedAccount} />
					<Route path="/historized-lendings" component={this.wrappedMyHistLendings} />
					<Route path="/historized-loans" component={this.wrappedMyHistLoans} />
					<Route path="/login" component={this.wrappedLogin} />
					<Route path="/subscribe" component={this.wrappedSubscribe} />
					<Route path="/camarche" component={CommentMarche} />
					<Route path="/faq" component={Faq} />
					<Route path="/infos" component={InformationsLegales} />
					<Route path="/contact" component={Contact} />
				</Switch>,
				<Footer></Footer>
    ]
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
