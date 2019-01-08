import React from 'react'
import helpers from '../../helpers/book/api'
import Book from '../book/Book'
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import theme from './MyBooks.scss'

class MyBooks extends React.Component {

	constructor(props) {
		super(props);
		this.state = { books: [] };
		this.handleDelete = this.handleDelete.bind(this);
		this.close = this.close.bind(this);
		this.validate = this.validate.bind(this);
	}

	componentDidMount() {
		helpers.getMyBooks().then((books) => {
			this.setState({
				books: books,
				showModal: false
			});
		});
	}

	handleDelete(event, idBook) {
		event.preventDefault();
		this.setState({
			showModal: true,
			showValidateModal: true,
			bookToDelete: idBook,
			messagesModal : [
				"Etes-vous sur ?",
				"Etes-vous sur de vouloir suprimer ce livre ?",
			]}
			);
	}

	close() {
		this.setState({ showModal: false });
	}

	validate() {
		helpers.deleteBook(this.state.bookToDelete).then((data) => {
			if (data == "0") {
				this.setState({
					showModal: true,
					showValidateModal: false,
					messagesModal : [
						"Livre en cours d'emprunt",
						"Ce livre est en cours d'emprunt par un utilisateur. Veuillez clore ce prêt afin de supprimer ce livre!",
					 ] });
			}
			else {
				this.componentDidMount();
			}
		})
	}

	render() {
		const books = this.state.books.map(book => {
			return <Book
						key={book.id}
						id={book.id}
						book={book}
						handleDelete={this.handleDelete}
						currentPage="myBooks"
						userId={this.props.userId}
					/>
		});
		return (
			<div>
				<h1>Ma bibiliothèque</h1>
				{books.length == 0 && <div><p>Vous n'avez pas de livres.</p></div>}
				{books.length > 0 && <div className="mybooks-container">{books}</div>}
				<Link to='/edit-book'><Button bsStyle="primary" bsSize="small">Ajouter livre</Button></Link>
				{this.state.showModal &&<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.messagesModal[0]}</Modal.Title>
					</Modal.Header>
					<Modal.Body>{this.state.messagesModal[1]}</Modal.Body>
					<Modal.Footer>
						{this.state.showValidateModal && <Button onClick={this.validate}>OK</Button>}
						<Button onClick={this.close}>Fermer</Button>
					</Modal.Footer>
				</Modal>}
			</div>
		)
	}
}

export default withRouter(MyBooks)
