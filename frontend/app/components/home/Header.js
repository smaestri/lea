import React from 'react'
import { Link } from 'react-router'
import { withRouter } from 'react-router'
import SearchBar from './SearchBar'
import Notification from './Notification'
import Footer from './Footer'
import helpers from '../../helpers/api'
import { DropdownButton, MenuItem, ButtonToolbar, Nav, NavItem, Navbar, NavDropdown } from 'react-bootstrap'
import style from './Header.scss'

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
		if (this.state.isConnected) {
			helpers.countEmpruntAndPret().then((countBean) => {
				this.setState({
					nbEmprunt: countBean.nbEmprunt,
					nbPret: countBean.nbPret
				});
			});
		}
	}

	refreshNotif() {
		if (this.state.isConnected) {
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

	checkIfConnected() {
		helpers.isAuthenticated().then(id => {
			this.setState({ isConnected: id != 0, userId: id })
			this.refreshCount();
			this.refreshNotif();
			this.refreshName();
		});
	}

	refreshName() {
		if (this.state.isConnected) {
			helpers.getAccount().then((user) => {
				this.setState({
					currentUser: user.firstName
				});
			});
		}
	}

	componentDidMount() {
		this.checkIfConnected();
	}

	render() {
		let menuUserConnected, menuUserNotConnected;
		let menuGeneral, notif = "";

		if (this.state.isConnected) {
			notif = (
				<Notification
					isNewPret={this.state.isNewPret}
					requestedFriends={this.state.requestedFriends}
					onRefreshNotification={this.refreshNotif} />);
		}
		const bienvenue = this.state.currentUser;
		menuGeneral = (<Navbar collapseOnSelect>
			<Navbar.Header>
				<Navbar.Brand>
					<a href="/">Livres entre amis</a>
				</Navbar.Brand>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
				<Nav>
					{this.state.isConnected && <NavItem eventKey={1}><Link to={'/my-books/'} >Ma bibliothèque</Link></NavItem>}
					{this.state.isConnected && <NavItem eventKey={2}><Link to={'/my-loans/'} >Mes emprunts ({this.state.nbEmprunt})</Link></NavItem>}
					{this.state.isConnected && <NavItem eventKey={2}><Link to={'/my-lendings/'} >Mes prêts ({this.state.nbPret})</Link></NavItem>}
					{this.state.isConnected && <NavItem eventKey={2}><Link to={'/my-friends/'} >Mes amis</Link></NavItem>}
					<SearchBar />
					{this.state.isConnected && <NavDropdown eventKey={3} title={`Bienvenue, ${bienvenue}`} pullRight>
						<MenuItem eventKey="3"><Link to={'/historized-loans/'}>Mes emprunts historiés</Link></MenuItem>
						<MenuItem eventKey="3"><Link to={'/historized-lendings/'}>Mes prêts historiés</Link></MenuItem>
						<MenuItem eventKey="4"><Link to={'/account/'}>Mon compte</Link></MenuItem>
						<MenuItem eventKey="4" href="/logout">Me déconnecter</MenuItem>
					</NavDropdown>}
					{!this.state.isConnected &&
						<Nav pullRight>
							<MenuItem href="/login">Se connecter</MenuItem>
							<MenuItem href="/users/new">S'inscrire</MenuItem>
						</Nav>
					}

				</Nav>
			</Navbar.Collapse>
		</Navbar>
		)
		return (
			<div>
				<div>
					{menuGeneral}

				</div>
				<div>
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
