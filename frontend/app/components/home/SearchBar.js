import React from 'react';
import { withRouter } from 'react-router'
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'
import helpers from '../../helpers/api'
import style from './SearchBar.scss'

class SearchBar extends React.Component {

	constructor(props) {
		super(props);
		this.searchBook = this.searchBook.bind(this);
	}

	searchBook() {
		this.props.router.push({ pathname: '/list-book' })
	}

	render() {
		return (
			<Navbar.Form pullLeft>
				<FormGroup>
					<FormControl type="text" placeholder="Indiquez le titre d'un livre, auteur, etc à emprunter" />
				</FormGroup>
				{' '}
				<Button type="submit" onClick={this.searchBook}>Rechercher</Button>
			</Navbar.Form>
		)
	}
}

export default withRouter(SearchBar);
