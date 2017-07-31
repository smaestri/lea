import React from 'react'
import helpers from '../helpers/api'
import { withRouter } from 'react-router'
import AddAvis from './AddAvis'
import { Link } from 'react-bootstrap'

class EditBook extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			book: { titreBook: '', auteur: '', description: '', isbn: '', categorieId: '', avis: [] },
			avis: {rating: '', libelle: ''},
			categories: [],
			auteurAvis: {}
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAvisChange = this.handleAvisChange.bind(this);
		this.returnToBooks = this.returnToBooks.bind(this);
	}

	componentDidMount() {
		//if id passed load exising book
		if (this.props.params && this.props.params.bookId) {
			helpers.getBookDetail(this.props.params.bookId).then((book) => {


				// if user post avis on his book, search this avis to editMode		const auteurAvis = this.state.book.avis.find((avis)=>{
				const auteurAvis = book.avis.find((avis)=>{
					if(this.props.userId == avis.auteur ){
						return avis;
					}
				})

				this.setState({ book: book, auteurAvis });

			})
		}

		helpers.getCategories().then((cat) => {
			this.setState({
				categories: cat
			});
		});
	}

	returnToBooks() {
		this.props.router.push('/my-books')
	}

	handleSubmit(event) {
		event.preventDefault();
		// first save book
		helpers.saveBook(this.state.book).then((book) => {
			// then save avis
			helpers.saveAvis(
				this.state.avis,
				 this.state.auteurAvis.id,
				 book.id).then((newAvisId) => {
				this.props.router.push('/my-books')
			});
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
		const catReact = this.state.categories.map(category => {
			return <option value={category.id}>{category.name}</option>
		});

		return (
			<div className="container">
				<div className="contact-form">
					<h2>Veuillez indiquer les informations du livre</h2>
					<form horizontal onSubmit={this.handleSubmit}>
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
							avis={this.state.auteurAvis || []}
							updateAvis={this.handleAvisChange}
							allowModification={false}
					  />

						<button onClick={this.returnToBooks}>Retour</button>
						<button type="submit">Valider</button>
					</form>
				</div>
			</div>
		)
	}

}

export default withRouter(EditBook);
