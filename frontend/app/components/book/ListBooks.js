import React from 'react'
import helpers from '../../helpers/book/api'
import Book from './Book'
import { Button } from 'react-bootstrap'
import './ListBook.scss'

class ListBooks extends React.Component {

	constructor(props) {
		super(props);
		this.state = { books: [], pendingFriends: [], displaySpinner: false, categoryName: '' };
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
			category = nextProps.match.params.category;

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
    this.props.displaySpinner();
		helpers.getAllBooks(category, search).then((books) => {
      this.props.hideSpinner();
			this.setState({ books, displaySpinner: false });
			if( category == 0) {
				this.setState({ categoryName: 'Toutes' })
			}
			if (category && category != 0) {
				// obtenir nom catgeorie pour affichage
				helpers.getCategories().then((categories) => {
					const catName = categories.find((cat) => (cat.id == category)).name;
					this.setState({ categoryName: catName })
				});
			}

		});

	}

	componentDidMount() {
		this._getBooks();
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
          displaySpinner={this.props.displaySpinner}
          hideSpinner={this.props.hideSpinner}
				/>)
		});

		return (
      <section>
        <div className='container'>
        {this.props.location && this.props.location.pathname && this.props.location.pathname.indexOf('list-book-by-category') != -1 &&
          <h1>Liste des livres pour la catégorie {this.state.categoryName} </h1>}
          {this.props.location && this.props.location.pathname && (this.props.location.pathname == '/list-book/')&&
          <h1>Tous les livres </h1>}
          {this.props.location && this.props.location.pathname && this.props.location.pathname.indexOf('list-book-by-term') != -1 && this.props.match.params.search &&
          <h1>Liste des livres pour le terme '{this.props.match.params.search}'</h1>}
          <div className="row justify-content-center">
              <div className="col d-flex flex-wrap justify-content-center">
              {this.state.displaySpinner && <div id="overlay"><div className="spinner-bg" /></div>}
              
              {books.length == 0 && <div >Pas de résultat.</div>}
              {books.length > 0 && <div className="list-book">{books}</div>}
            </div>
            {/* <Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button> */}
          </div>
        </div>
      </section>
			
		)
	}
}

export default ListBooks
