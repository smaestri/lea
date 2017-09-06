import React from 'react'
import helpers from '../../helpers/api'
import Book from './Book'

class ListBooks extends React.Component {

	constructor(props) {
		super(props);
		this.state = { books: [], pendingFriends: [] };
		this._getBooks = this._getBooks.bind(this);
	}

	_getBooks() {
		helpers.getAllBooks().then((books) => {
			this.setState({ books });
		});
	}

	componentDidMount() {
		this._getBooks();
	}

	componentWillReceiveProps() {
		this._getBooks();
	}

	render() {
		const books = this.state.books.map(book => {
			return <Book
							 key={book.id}
							 id={book.id}
							 book={book}
							 previousPage="listBook"
			         pendingFriends={this.state.pendingFriends}
							 userId={this.props.userId}
						 />
		});

		return (
			<div className="container">
				<h1>Livres empruntables</h1>
				{books.length == 0 && <span>Pas de livres empruntables.</span>}
				{books.length > 0 && <div className="book-container">{books}</div>}
			</div>
		)
	}
}

export default ListBooks
