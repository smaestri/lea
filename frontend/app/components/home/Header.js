import React from 'react'
import { Link } from 'react-router'
import { withRouter } from 'react-router'
import SearchBar from './SearchBar'
import Notification from './Notification'
import Footer from './Footer'
import helpers from '../../helpers/api'


const { Component } = React;

class Header extends Component {

	constructor(props) {
		super(props);
		this.refreshCount = this.refreshCount.bind(this);
		this.refreshNotif = this.refreshNotif.bind(this);
		this.refreshName = this.refreshName.bind(this);
		this.checkIfConnected = this.checkIfConnected.bind(this);
		this.state = {
			nbEmprunt: 0,
			nbPret: 0,
			isNewPret: false,
			requestedFriends: [],
			currentUser: '',
			isConnected: false
		};
		this.props.router.push('/home')
	}

	refreshCount() {
			if (this.state.isConnected){
				helpers.countEmpruntAndPret().then((countBean) => {
					this.setState({
						nbEmprunt: countBean.nbEmprunt,
						nbPret: countBean.nbPret
					});
				});
			}
	}

	refreshNotif() {
		if (this.state.isConnected){
				helpers.getMyRequestedFriends().then((friends) => {
					this.setState({
						requestedFriends: friends
					});
				});
				helpers.isNewPret().then((isNewPret) => {
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

	checkIfConnected(){
		helpers.isAuthenticated().then( id => {
			this.setState({isConnected: id != 0, userId: id})
			this.refreshCount();
			this.refreshNotif();
			this.refreshName();
		});

	}

	refreshName() {
		const res =
		console.log('toto')
		console.log(res)
		if (this.state.isConnected){
				helpers.getAccount().then((user) => {
					this.setState({
						currentUser: user.fullName
					});
				});
		}
	}

	componentDidMount() {
		this.checkIfConnected();
	}

	render() {
		console.log('render home')

		let menuUser;
		let menugeneral, notif = "";

		if (this.state.isConnected){
			notif = (
				<Notification
					isNewPret={this.state.isNewPret}
					requestedFriends={this.state.requestedFriends}
					onRefreshNotification={this.refreshNotif}/>);

			const bienvenue = this.state.currentUser;

			menuUser = (<div className="dropdown">
				<span className="arrow">Bienvenue, {bienvenue}</span>
				<div className="dropdown-content">
					<ul>
						<li>
							<Link to={'/historized-loans/'}>
								Mes emprunts historiés
							</Link>
						</li>
						<li>
							<Link to={'/historized-lendings/'}>
								Mes prêts historiés
							</Link>
						</li>
						<li>
							<Link to={'/account/'}>
								Mon compte
							</Link>
						</li>
						<li>
							<a href="logout">
								Me déconnecter
							</a>
						</li>
					</ul>
				</div>
			</div>);
			menugeneral = (<nav id="main-nav" className="two-thirds column omega">
				<a href="#main-nav-menu" className="mobile-menu-button button">+ Menu</a>
				<ul id="main-nav-menu" className="nav-menu">
					<li id="nav-home" className="current">
						<Link to={'/home/'} activeClassName="current">
							Accueil
						</Link>
					</li>
					<li id="nav-bib">
						<Link to={'/my-books/'} activeClassName="current">
							Ma bibliothèque
						</Link>
					</li>
					<li id="nav-emprunt">
						<Link to={'/my-loans/'} activeClassName="current">
							Mes emprunts ({this.state.nbEmprunt})
						</Link>
					</li>
					<li id="nav-portfolio">
						<Link to={'/my-lendings/'} activeClassName="current">
							Mes prêts ({this.state.nbPret})
						</Link>
					</li>
					<li id="nav-amis">
						<Link to={'/my-friends/'} activeClassName="current">
							Mes amis
						</Link>
					</li>
				</ul>
			</nav>)
		}
		else {
			menuUser = (<div className="dropdown">
				<div className="top-menu">
					<a href="/login">Connexion</a>
					<a href="/users/new">Inscription</a>
				</div>
			</div>)
		}

		return (
			<div>
				<header id="header" className="container">

					<div id="header-inner" className="row">

						<div id="masthead">
							<h1 id="site-title" className="remove-bottom">
								<a href="/"><img src="/webjars/app-react/1.0.0/img/logo.png"/></a>
							</h1>
						</div>

						<div className="container-search">
							<div className="top-header">
								<div className="content-search">
									<SearchBar />
								</div>
								<div className="menu-user">
									{menuUser}

								</div>
							</div>
							<div className="top-menu">
								{menugeneral}
							</div>
						</div>
					</div>

				</header>
				<div className="container">
					{notif}
				</div>
				{this.props.children && React.cloneElement(this.props.children, {
					onRefreshCount: this.refreshCount,
					onRefreshNotification: this.refreshNotif,
					onRefreshName: this.refreshName,
					userId: this.state.userId
				})}
				<Footer></Footer>

			</div>
		)
		}
}

export default withRouter(Header)
