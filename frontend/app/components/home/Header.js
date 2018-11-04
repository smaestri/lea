import React from 'react'
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, FormGroup, FormControl, MenuItem, Nav, NavItem, NavDropdown  } from 'react-bootstrap'
import {  Redirect } from 'react-router-dom'
import style from './Header.scss'


const { Component } = React;

class Header extends Component {

	constructor(props) {
		super(props);
		this.logout = this.logout.bind(this);
		
	}

	logout() {
		this.props.logout();
	}

	render() {
		
		//redirect to login if logout triggered
		if (this.props.redirectToLogin && !(this.props.location.pathname === '/login')) {
            return <Redirect to='/login' />;
        }

		let menuGeneral;
		
		menuGeneral = (
		<Navbar collapseOnSelect>
			<Navbar.Header>
				<Navbar.Brand>
					<a href="/">Livres entre amis</a>
				</Navbar.Brand>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
				{this.props.isConnected && <Nav>
						<NavItem><LinkContainer to={'/my-books/'} ><span>Ma bibliothèque</span></LinkContainer></NavItem>
						<NavItem><LinkContainer to={'/my-loans/'} ><span>Mes emprunts ({this.props.nbEmprunt})</span></LinkContainer></NavItem>
						<NavItem><LinkContainer to={'/my-lendings/'} ><span>Mes prêts ({this.props.nbPret})</span></LinkContainer></NavItem>
						<NavItem><LinkContainer to={'/my-friends/'} ><span>Mes amis</span></LinkContainer></NavItem>
					</Nav>
				}
				<Navbar.Form pullLeft>
					<FormGroup>
						<FormControl type="text" placeholder="Indiquez le titre d'un livre, auteur, etc à emprunter" />
					</FormGroup>
					{' '}
					<LinkContainer to='/list-book'><button className="btn">Rechercher</button></LinkContainer>
				</Navbar.Form>
				{this.props.isConnected && <Nav>
				<NavDropdown id="basic-nav-dropdown" title={`Bienvenue, ${this.props.currentUser}`} pullRight>
					<MenuItem><LinkContainer to={'/historized-loans/'}><span>Mes emprunts historiés</span></LinkContainer></MenuItem>
					<MenuItem><LinkContainer to={'/historized-lendings/'}><span>Mes prêts historiés</span></LinkContainer></MenuItem>
					<MenuItem><LinkContainer to={'/account/'}><span>Mon compte</span></LinkContainer></MenuItem>
					<MenuItem><span onClick={this.logout}>Me déconnecter</span></MenuItem>
				</NavDropdown>
				</Nav>	}
				{!this.props.isConnected &&
				<Nav>
					<NavItem><LinkContainer to="/login"><span>Se connecter</span></LinkContainer></NavItem>
					<NavItem><LinkContainer to="/subscribe"><span>S'inscrire</span></LinkContainer></NavItem>
				</Nav>					
				}
			</Navbar.Collapse>
		</Navbar>
		)
		return (
			<div className="header-container">
				{menuGeneral}
			</div>
		)
	}
}

export default withRouter(Header)
