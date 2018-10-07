import React from 'react'
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import SearchBar from './SearchBar'
import Notification from './Notification'
import { MenuItem, Nav, NavItem, Navbar, NavDropdown } from 'react-bootstrap'

import style from './Header.scss'

const { Component } = React;

class Header extends Component {

	render() {
		let menuGeneral, notif = "";
		if (this.props.isConnected) {
			notif = (
				<Notification
					isNewPret={this.props.isNewPret}
					requestedFriends={this.props.requestedFriends}
					onRefreshNotification={this.props.refreshNotif} />);
		}
		const bienvenue = this.props.currentUser;
		menuGeneral = (
		<Navbar collapseOnSelect>
			<Navbar.Header>
				<Navbar.Brand>
					<a href="/">Livres entre amis</a>
				</Navbar.Brand>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
				<Nav>
					{this.props.isConnected && <NavItem eventKey={1}><LinkContainer to={'/my-books/'} ><span>Ma bibliothèque</span></LinkContainer></NavItem>}
					{this.props.isConnected && <NavItem eventKey={2}><LinkContainer to={'/my-loans/'} ><span>Mes emprunts ({this.props.nbEmprunt})</span></LinkContainer></NavItem>}
					{this.props.isConnected && <NavItem eventKey={2}><LinkContainer to={'/my-lendings/'} ><span>Mes prêts ({this.props.nbPret})</span></LinkContainer></NavItem>}
					{this.props.isConnected && <NavItem eventKey={2}><LinkContainer to={'/my-friends/'} ><span>Mes amis</span></LinkContainer></NavItem>}
					<SearchBar />
					{this.props.isConnected &&
						<NavDropdown id="basic-nav-dropdown" eventKey={3} title={`Bienvenue, ${bienvenue}`} pullRight>
							<MenuItem eventKey="3"><LinkContainer to={'/historized-loans/'}><span>Mes emprunts historiés</span></LinkContainer></MenuItem>
							<MenuItem eventKey="3"><LinkContainer to={'/historized-lendings/'}><span>Mes prêts historiés</span></LinkContainer></MenuItem>
							<MenuItem eventKey="4"><LinkContainer to={'/account/'}><span>Mon compte</span></LinkContainer></MenuItem>
							<MenuItem eventKey="4" href="/logout"><span>Me déconnecter</span></MenuItem>
						</NavDropdown>
					}
				</Nav>
				{!this.props.isConnected &&
				<div>
					<a href="/login">Se connecter</a> - 
					<a href="/users/new">S'inscrire</a>
				</div>					
				}
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
			</div>
		)
	}
}

export default withRouter(Header)
