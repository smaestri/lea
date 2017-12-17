import React from 'react'
import { withRouter } from 'react-router'
import { Link, ControlLabel, Col, FormGroup, FormControl, Button, Form, ButtonToolbar } from 'react-bootstrap'
import helpers from '../../helpers/api'
import AddAvis from '../book/AddAvis'
import theme from './EditBook.scss'

class EditBook extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			book: null,
			avis: null,
			categories: null,
			auteurAvis: null,
			displaySpinner: false
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAvisChange = this.handleAvisChange.bind(this);
		this.returnToBooks = this.returnToBooks.bind(this);
	}

	componentDidMount() {
		helpers.getCategories().then((categories) => {
			this.setState({ categories });
		});

		if (this.props.params && this.props.params.bookId) {
			helpers.getBookDetail(this.props.params.bookId).then((book) => {
				// if user post avis on his book
				const auteurAvis = book.avis.find((avis) => {
					if (this.props.userId == avis.auteur) {
						return avis;
					}
				})
				this.setState({ book: book, auteurAvis });
			})
		} else {
			this.setState({ book: { titreBook: '', auteur: '', description: '', isbn: '' } });
		}
	}

	returnToBooks() {
		this.props.router.push('/my-books')
	}

	handleSubmit(event) {
		event.preventDefault();

		if(!this.state.book || !this.state.book.titreBook){
			alert('Saisir un nom de livre SVP.');
			return;
		}

		// first save book
		helpers.saveBook(this.state.book).then((book) => {
			// then save avis if state modified
			if (this.state.avis) {
				helpers.saveAvis(this.state.avis, book.id).then((newAvisId) => {
					this.props.router.push('/my-books')
				});
			} else {
				this.props.router.push('/my-books')
			}
		});
	}

	handleChange(event) {
		const book = this.state.book;
		const eventName = event.target.name;
		const eventValue = event.target.value;
	
		if(eventName === 'isbn') {
			book['auteur'] = ""
			book['image'] = ""
			book['titreBook'] = ""
			if(event.target.value.length === 10 || event.target.value.length === 13){
				//display spinner
				this.setState({ displaySpinner: true });
				const info = helpers.fetchBookInfoFromAmazon(event.target.value).then ( result => {
					book['auteur'] = result['auteur']
					book['image'] = result['image']
					book['titreBook'] = result['name']
					book['isbn'] = eventValue
					this.setState({ book, displaySpinner: false });
					return;
				})
			}
		}
	
		book[eventName] = eventValue;
		this.setState({ book: book });
	}

	handleAvisChange(avis) {
		this.setState({
			avis
		})
	}

	render() {
		const catReact = this.state.categories && this.state.categories.map(category => {
			return <option value={category.id} selected={this.state.book.categorieId === category.id}>{category.name}</option>
		});

		return (
		
			<div className="editbook-container">
			{this.state.displaySpinner && <div id ="overlay"><div className="spinner-bg"/></div>}
				<h2>Ajouter un livre</h2>
				{this.state.book && 
				<div className="main-content">
					<Col className="content-image">
						<div className='container-image'>
							<img className='content-image' src={this.state.book.image} />
						</div>
					</Col>
					<Col className="content-form">
						<Form horizontal>
							<span>Remplissez l'ISBN sur 10 ou 13 caractères afin de remplir automaituqment les informations du livre!</span>
							<FormGroup>
								<Col for="isbn" sm={2}>isbn:</Col>
								<Col sm={10}>
									<FormControl type="text" name="isbn" value={this.state.book.isbn} onChange={this.handleChange} />
								</Col>
							</FormGroup>
							<FormGroup>
								<Col for="titreBook" sm={2}>titre:</Col>
								<Col sm={10}>
									<FormControl type="text" name="titreBook" value={this.state.book.titreBook} onChange={this.handleChange} />
								</Col>
							</FormGroup>
							
							<FormGroup>
								<Col for="auteur" sm={2}>Auteur:</Col>
								<Col sm={10}>
									<FormControl type="text" name="auteur" value={this.state.book.auteur} onChange={this.handleChange} />
								</Col>
							</FormGroup>
							<FormGroup>
								<Col for="description" sm={2}>description:</Col>
								<Col sm={10}>
									<FormControl type="text" name="description" value={this.state.book.description} onChange={this.handleChange} />
								</Col>
							</FormGroup>
						
							<FormGroup>
								<Col for="Catégorie"sm={2}>Catégorie:</Col>
								<Col sm={10}>
									<FormControl name="categorieId" componentClass="select" placeholder="select" onChange={this.handleChange}>
										{catReact}
									</FormControl>
								</Col>
							</FormGroup>
							<FormGroup>
								<Col for="note" sm={2}>Noter ce livre</Col>
								<Col sm={10}>
									<AddAvis
										showInput={true}
										avis={this.state.auteurAvis || null}
										updateAvis={this.handleAvisChange} />
								</Col>
							</FormGroup>
							<ButtonToolbar className="text-center">
								<Button  bsStyle="primary" type="submit" onClick={this.handleSubmit}>Valider</Button>
							</ButtonToolbar>
							<Button onClick={this.returnToBooks}>Retour</Button>
						</Form>
					</Col>
				</div>}
			</div>
		)
	}
}

export default withRouter(EditBook);
