import React from 'react';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'
import style from './SearchBar.scss'

class SearchBar extends React.Component {

	render() {
		return (
			<Navbar.Form pullLeft>
				<FormGroup>
					<FormControl type="text" placeholder="Indiquez le titre d'un livre, auteur, etc à emprunter" />
				</FormGroup>
				{' '}
				<Link to='/list-book'>Rechercher</Link>
			</Navbar.Form>
		)
	}
}

export default withRouter(SearchBar);
