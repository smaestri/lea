import React from 'react'
import { withRouter } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, FormGroup, Form, FormControl, Button, MenuItem, Nav, NavItem, NavDropdown } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import './Header.scss'


const { Component } = React;

class Header extends Component {

	constructor(props) {
		super(props);
		this.state = { searchTerm: '' };
		this.logout = this.logout.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

	}

	logout() {
		this.props.logout();
	}

	handleSearchChange(event) {
		this.setState({searchTerm: event.target.value});
	}

	handleSubmit() {
		let url = '/list-book-by-term/' + this.state.searchTerm;
		if (!this.state.searchTerm) {
			url = '/list-book/';
		}
		this.props.history.push(url)
	}

	render() {

		// redirect to login if logout triggered
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
						<LinkContainer to={'/my-books/'} ><NavItem >Ma bibliothèque</NavItem></LinkContainer>
						<LinkContainer to={'/my-loans/'} ><NavItem>Mes emprunts ({this.props.nbEmprunt})</NavItem></LinkContainer>
						<LinkContainer to={'/my-lendings/'}><NavItem>Mes prêts ({this.props.nbPret})</NavItem></LinkContainer>
						<LinkContainer to={'/my-friends/'} ><NavItem>Mes amis</NavItem></LinkContainer>
					</Nav>
					}
					<Navbar.Form pullLeft onSubmit={this.handleSubmit}>
					<Form>
						<FormGroup>
							<FormControl type="text" placeholder="livre, auteur, etc." onChange={this.handleSearchChange} />
						</FormGroup>
						{' '}
						<Button type="submit" className="btn">Rechercher</Button>
						</Form>
					</Navbar.Form>
					{this.props.isConnected && <Nav>
						<NavDropdown id="basic-nav-dropdown" title={`Bienvenue, ${this.props.currentUser}`} pullRight>
							<LinkContainer to={'/historized-loans/'}><MenuItem>Mes emprunts historiés</MenuItem></LinkContainer>
							<LinkContainer to={'/historized-lendings/'}><MenuItem>Mes prêts historiés</MenuItem></LinkContainer>
							<LinkContainer to={'/account/'}><MenuItem>Mon compte</MenuItem></LinkContainer>
							<MenuItem><span onClick={this.logout}>Me déconnecter</span></MenuItem>
						</NavDropdown>
					</Nav>}
					{!this.props.isConnected &&
						<Nav>
							<LinkContainer to="/login"><NavItem>Se connecter</NavItem></LinkContainer>
							<LinkContainer to="/subscribe"><NavItem>S'inscrire</NavItem></LinkContainer>
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
