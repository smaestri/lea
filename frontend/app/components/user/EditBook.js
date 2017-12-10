import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-bootstrap'
import helpers from '../../helpers/api'
import AddAvis from '../book/AddAvis'

class EditBook extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			book: null,
			avis: null,
			categories: null,
			auteurAvis: null,
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAvisChange = this.handleAvisChange.bind(this);
		this.returnToBooks = this.returnToBooks.bind(this);
	}

	componentDidMount() {
		helpers.getCategories().then((cat) => {
			this.setState({categories: cat});
		});

		if (this.props.params && this.props.params.bookId) {
			helpers.getBookDetail(this.props.params.bookId).then((book) => {
				// if user post avis on his book
				const auteurAvis = book.avis.find((avis)=>{
					if(this.props.userId == avis.auteur ){
						return avis;
					}
				})
				this.setState({ book: book, auteurAvis });
			})
		} else{
			this.setState({ book: {titreBook: '', auteur: '', description: '', isbn: ''} });
		}
	}

	returnToBooks() {
		this.props.router.push('/my-books')
	}

	handleSubmit(event) {
		event.preventDefault();
		// first save book
		helpers.saveBook(this.state.book).then((book) => {
			// then save avis if state modified
			if(this.state.avis){
				helpers.saveAvis(this.state.avis, book.id).then( (newAvisId) => {
					this.props.router.push('/my-books')
				});
			} else {
				this.props.router.push('/my-books')
			}
		});
	}

	handleChange(event) {
		const book = this.state.book;
		book[event.target.name] = event.target.value;
		this.setState({ book: book });
	}

	handleAvisChange (avis){
		this.setState({
			avis
		})
	}

	render() {
		const catReact = this.state.categories && this.state.categories.map(category => {
			return <option value={category.id}>{category.name}</option>
		});

		return (
			<div className="container">
				{this.state.book && <div className="contact-form">
					<h2>Veuillez indiquer les informations du livre</h2>
					<form horizontal>
						<label for="titreBook">titre:</label>
						<input type="text" name="titreBook" value={this.state.book.titreBook}
						       onChange={this.handleChange}/>
						<label for="auteur">Auteur:</label>
						<input type="text" name="auteur" value={this.state.book.auteur}
						       onChange={this.handleChange}/>
						<label for="description">description:</label>
						<input type="text" name="description" value={this.state.book.description}
						       onChange={this.handleChange}/>
						<label for="isbn">isbn:</label>
						<input type="text" name="isbn" value={this.state.book.isbn}
						       onChange={this.handleChange}/>
						<label for="Catégorie">Catégorie:</label>
						<select name="categorieId" value={this.state.book.categorieId}
						        onChange={this.handleChange}>
							{catReact}
						</select>

						<label for="note">Noter ce livre</label>
						<AddAvis
							showInput={true}
							avis={this.state.auteurAvis || null}
							updateAvis={this.handleAvisChange}
					  />
						<button onClick={this.returnToBooks}>Retour</button>
						<button type="submit" onClick={this.handleSubmit}>Valider</button>
					</form>
				</div>}
			</div>
		)
	}
}

export default withRouter(EditBook);
