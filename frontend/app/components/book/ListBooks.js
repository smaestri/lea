import React from 'react'
import helpers from '../../helpers/book/api'
import Book from './Book'
import { Button } from 'react-bootstrap'
import './ListBooks.scss'

class ListBooks extends React.Component {

	constructor(props) {
		super(props);
		this.state = { books: [], pendingFriends: [], displaySpinner: false };
		this._getBooks = this._getBooks.bind(this);
	}

	_getBooks(nextProps) {
		// si new location = list-book, on recupere tout
		if (nextProps && nextProps.location && nextProps.location.pathname && nextProps.location.pathname === '/list-book/') {
			this.fetchBook();
			return;
		}

		let category = this.props.match.params.category;
		let search = this.props.match.params.search;
		if (nextProps && nextProps.match.params && nextProps.match.params.category) {
			category = nextProps.match.params.category
		} else {
			if (nextProps && nextProps.match && nextProps.match.params && nextProps.match.params.search) {
				search = nextProps.match.params.search
			}
		}
		this.fetchBook(category, search);
		return;
	}

	fetchBook(category, search) {
		this.setState({ displaySpinner: true });
		helpers.getAllBooks(category, search).then((books) => {
			this.setState({ books, displaySpinner: false });
		});

	}

	componentDidMount() {
		this._getBooks();
	}

	componentWillReceiveProps(nextProps) {
		this._getBooks(nextProps);
	}

	render() {
		const books = this.state.books.map(book => {
			return (
				<Book
					key={book.id}
					id={book.id}
					book={book}
					currentPage="listBook"
					pendingFriends={this.state.pendingFriends}
					userId={this.props.userId}
				/>)
		});

		return (
			<div className='container-list-book'>
				{this.state.displaySpinner && <div id ="overlay"><div className="spinner-bg"/></div>}
				<h1>Livres empruntables</h1>
				{books.length == 0 && <span>Pas de livres empruntables.</span>}
				{books.length > 0 && <div className="list-book">{books}</div>}
				<Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button>
			</div>
		)
	}
}

export default ListBooks
