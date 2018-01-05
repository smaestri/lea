import React from 'react'
import helpers from '../../helpers/api'
import Book from './Book'
import style from './ListBooks.scss'

class ListBooks extends React.Component {

	constructor(props) {
		super(props);
		this.state = { books: [], pendingFriends: [] };
		this._getBooks = this._getBooks.bind(this);
	}

	_getBooks(nextProps) {
		let category = this.props.params.category;
		if(nextProps && nextProps.params){
			category = nextProps.params.category
		}
		helpers.getAllBooks(category).then((books) => {
			this.setState({ books });
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
				<h1>Livres empruntables</h1>
				{books.length == 0 && <span>Pas de livres empruntables.</span>}
				{books.length > 0 && <div className="list-book">{books}</div>}
			</div>
		)
	}
}

export default ListBooks
