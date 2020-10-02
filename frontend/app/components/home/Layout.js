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
import LoanDetail from '../loan/LoanDetail'
import MyRequestedFriends from "../user/MyRequestedFriends";
import MyLendings from "../user/MyLendings";
import ListBooks from "../book/ListBooks";
import EditBook from "../user/EditBook";
import BookDetail from "../book/BookDetail";
import UserDetail from "../user/UserDetail";
import Notification from "./Notification";
import Account from "../user/Account";
import helpersLoan from '../../helpers/loan/api'
import helpersFriend from '../../helpers/friend/api'
import helpersUser from '../../helpers/user/api'
import Footer from './footer/Footer';
import MyBooks from '../user/MyBooks';
import Login from '../login/Login'
import helpers from '../../helpers/user/api';
import $ from "jquery"

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
      redirectToLogin: false,
      spinnerCounter: 0,
      loading: false
    };
    
this.spinnerCounter = 0;

    this.displaySpinner = this.displaySpinner.bind(this);
    this.hideSpinner = this.hideSpinner.bind(this);

		this.wrappedMyLoans = (props) => {
			return (
				<MyLoans
				  userId={this.state.userId}
					onRefreshCount={this.refreshCount.bind(this)}
          onRefreshNotif={this.refreshNotif.bind(this)}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
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
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					{...props}
				/>
			);
		}

		this.wrappedListBooks = (props) => {
			return (
				<ListBooks
          userId={this.state.userId}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					{...props}
				/>
			);
		}

		this.wrappedMyBooks = (props) => {
			return (
				<MyBooks
          userId={this.state.userId}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
          {...props}
          
				/>
			);
		}

		this.wrappedUserDetail = (props) => {
			return (
				<UserDetail
          userId={this.state.userId}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					{...props}
				/>
			);
    }
    
    this.wrappedLoanDetail = (props) => {
			return (
				<LoanDetail
          userId={this.state.userId}
          onRefreshCount={this.refreshCount.bind(this)}
          onRefreshNotif={this.refreshNotif.bind(this)}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					{...props}
				/>
			);
		}

		this.wrappedEditBook = (props) => {
			return (
				<EditBook
          userId={this.state.userId}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					{...props}
				/>
			);
		}

		this.wrappedAccount = (props) => {
			return (
				<Account
					isCreation={false}
          refreshUserConnected={this.refreshUserConnected.bind(this)}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					{...props}
				/>
			);
		}

		this.wrappedSubscribe = (props) => {
			return (
				<Account
					isCreation={true}
          refreshUserConnected={this.refreshUserConnected.bind(this)}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					{...props}
				/>
			);
		}

		this.wrappedLogin= (props) => {
			return (
				<Login
          refreshUserConnected={this.refreshUserConnected.bind(this)}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					{...props}
				/>
			);
		}

		this.wrappedMyFriends = (props) => {
			return (
				<MyFriends
          onRefreshNotification={this.refreshNotif.bind(this)}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					{...props}
				/>
			);
    }
    
    this.wrappedBookDetail = (props) => {
			return (
				<BookDetail
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
          {...props}
				/>
			);
		}

		this.wrappedRequestedFriends = (props) => {

			return (
				<MyRequestedFriends
          onRefreshNotification={this.refreshNotif.bind(this)}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					{...props}
				/>
			);
			
		}
  }
  
  displaySpinner() {
    this.setState({loading: true})
    this.spinnerCounter = this.spinnerCounter +1;
    $('#app').removeClass('loaded');
  }

  hideSpinner() {
    this.spinnerCounter = this.spinnerCounter -1;
    if(this.spinnerCounter == 0 ){
      this.setState({loading: true})
      $('#app').addClass('loaded');
    }
  }

	componentDidMount() {
		this.refreshUserConnected();
  }
  
	render() {
		let notifications = "";
		if (this.state.isConnected  && (this.state.isNewPret || this.state.requestedFriends.length)) {
			notifications = (
				<Notification
					isNewPret={this.state.isNewPret}
					requestedFriends={this.state.requestedFriends}
					onRefreshNotification={this.refreshNotif} />);
    }
		return (
    <>	
      { this.state.loading && <div className="loader">
        <div className="loading-animation"></div>
      </div>}
				<Header
					currentUser={this.state.currentUser}
					isConnected={this.state.isConnected}
          redirectToLogin={this.state.redirectToLogin}
          displaySpinner={this.displaySpinner}
          hideSpinner={this.hideSpinner}
					nbPret={this.state.nbPret}
					nbEmprunt={this.state.nbEmprunt}
					logout={this.logout.bind(this)}
          notifications={notifications}>
				</Header>
				<Switch>
					<Route exact path="/" component={Home}></Route>
					<Route path="/my-books" component={this.wrappedMyBooks}></Route>
					<Route exact path="/edit-book" component={this.wrappedEditBook} />
					<Route exact path="/edit-book/:bookId" component={this.wrappedEditBook} />
					<Route path="/my-loans" component={this.wrappedMyLoans} />
					<Route path="/book-detail/:bookId" component={this.wrappedBookDetail} />
					<Route exact path="/list-book" component={this.wrappedListBooks} />
					<Route exact path="/list-book-by-category/:category" component={this.wrappedListBooks} />
					<Route exact path="/list-book-by-term/:search" component={this.wrappedListBooks} />
					<Route path="/my-lendings" component={this.wrappedMyLendings} />
					<Route path="/my-friends" component={this.wrappedMyFriends} />
					<Route path="/my-requested-friends" component={this.wrappedRequestedFriends} />
					<Route path="/user-detail/:userId" component={this.wrappedUserDetail} />
          <Route path="/loan-detail/:loanId" component={this.wrappedLoanDetail} />
					<Route path="/account" component={this.wrappedAccount} />
					<Route path="/login" component={this.wrappedLogin} />
					<Route path="/subscribe" component={this.wrappedSubscribe} />
					<Route path="/camarche" component={CommentMarche} />
					<Route path="/faq" component={Faq} />
					<Route path="/infos" component={InformationsLegales} />
					<Route path="/contact" component={Contact} />
				</Switch>,
				<Footer></Footer>
      </>
		);
	}

	refreshUserConnected() {
    this.displaySpinner();
		helpersUser.isAuthenticated().then(id => {
      this.hideSpinner();
			this.setState({ isConnected: id != 0, userId: id, redirectToLogin: false})
			// this.refreshCount();
			this.refreshNotif();
			this.refreshName();
		});
  }

	refreshCount() {
		if (this.state.isConnected) {
      this.displaySpinner();
			helpersLoan.countEmpruntAndPret().then((countBean) => {
        this.hideSpinner();
				this.setState({
					nbEmprunt: countBean.nbEmprunt,
					nbPret: countBean.nbPret
				});
			});
		}
	}

	refreshNotif() {
		if (this.state.isConnected) {
      this.displaySpinner();
			helpersFriend.getMyRequestedFriends().then((friends) => {
        this.hideSpinner();
				this.setState({
					requestedFriends: friends
				});
      });
      this.displaySpinner();
			helpersLoan.isNewPret().then((isNewPret) => {
        this.hideSpinner();
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
      this.displaySpinner();
			helpersUser.getAccount().then((user) => {
        this.hideSpinner();
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
    this.displaySpinner();
		helpers.logout().then(() => {
      this.hideSpinner();
			this.refreshUserConnected();
		})
	}

	

}

export default Layout
