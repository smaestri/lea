import React from 'react'
import { withRouter } from 'react-router'
import {  Redirect } from 'react-router-dom'
import { Col, FormGroup, FormControl, Button, Form, ButtonToolbar } from 'react-bootstrap'
import helpersBook from '../../helpers/book/api'
import helpers from '../../helpers/api'
import AddAvis from '../book/AddAvis'
import { renderHTML} from '../../helpers/utils'
import theme from './EditBook.scss'

class EditBook extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			book: null,
			avis: null,
			categories: null,
			displaySpinner: false,
			redirect: false,
			manualFill: false,
			errors: []
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAvisChange = this.handleAvisChange.bind(this);
	}

	componentDidMount() {
		helpersBook.getCategories().then((categories) => {
			this.setState({ categories, book: {...this.state.book, categorieId: categories[0].id } });
		});

		if (this.props.match.params && this.props.match.params.bookId) {
			helpersBook.getBookDetail(this.props.match.params.bookId).then((book) => {
				// if user post avis on his book
				const auteurAvis = book.avis.find((avis) => {
					if (this.props.userId == avis.auteur) {
						return avis;
					}
				})
				this.setState({ book: book, avis: auteurAvis });
			})
		} else {
			this.setState({ book: { titreBook: '', auteur: '', description: '', isbn: '' } });
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		// first save book
		helpersBook.saveBook(this.state.book).then((response) => {
			// then save avis if state modified
			if (this.state.avis) {
				helpersBook.saveAvis(this.state.avis, response.data.livreModelId).then(() => {
					this.setState({ redirect: true });
				});
			} else {
				this.setState({ redirect: true });
			}
		}, 
		(response)=> {
			if(response.data && response.data.errors && response.data.errors.length > 0) {
				this.setState({errors: response.data.errors});
				window.scrollTo(0, 0);
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
					book['auteur'] = result.data['auteur']
					book['image'] = result.data['image']
					book['titreBook'] = result.data['name']
					book['isbn'] = eventValue
					this.setState({ book, displaySpinner: false });
					return;
				}, ()=> {
					alert('error during amazon fetching')
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
		if (this.state.redirect) {
			return <Redirect to='/my-books'/>;
		}

		let errors = [];
		if (this.state.errors) {
			errors = this.state.errors.map(err => {
				return <div className="error" key={err.field+err.code}>{err.defaultMessage}</div>
			});
		}

		const catReact = this.state.categories && this.state.categories.map(category => {
			return <option key={category.id} value={category.id}>{category.name}</option>
		});

		return (
		
			<div className="editbook-container">
			
			{this.state.displaySpinner && <div id ="overlay"><div className="spinner-bg"/></div>}
				{this.props.match.params && this.props.match.params.bookId && <h2>Modifier livre</h2>}
				{!this.props.match.params || !this.props.match.params.bookId && <h2>Ajouter un livre</h2>}
				{this.state.book && 
				<div className="main-content">
					
					<Col className="content-image">
						<div className='container-image'>
							<img className='content-image' src={this.state.book.image} />
						</div>
					</Col>
					<Col className="content-form">
						{errors && errors.length > 0 && <div className="error-container">{errors}</div>}
						<Form horizontal>
							<span>Remplissez l'ISBN sur 10 ou 13 caractères afin de remplir automatiquement les informations du livre!</span>
							<FormGroup>
								<Col sm={2}>isbn:</Col>
								<Col sm={10}>
									<FormControl type="text" name="isbn" value={this.state.book.isbn} onChange={this.handleChange} />
								</Col>
							</FormGroup>
							{this.state.book && this.state.book.titreBook && <FormGroup >
								<Col sm={2} disabled>titre:</Col>
								<Col sm={10}>
									{!this.state.manualFill && renderHTML(this.state.book.titreBook)}
									{this.state.manualFill && <FormControl disabled type="text" name="titreBook" value={this.state.book.titreBook != ''?renderHTML(this.state.book.titreBook):''} onChange={this.handleChange} />}
								</Col>
							</FormGroup>}
							
							{this.state.book && this.state.book.auteur && <FormGroup>
								<Col sm={2}>Auteur:</Col>
								<Col sm={10}>
									{!this.state.manualFill && renderHTML(this.state.book.auteur)}
									{this.state.manualFill && <FormControl disabled type="text" name="auteur" value={this.state.book.auteur} onChange={this.handleChange} />}
								</Col>
							</FormGroup>}
							{this.state.book && this.state.book.description && <FormGroup>
								<Col sm={2}>description:</Col>
								<Col sm={10}>
									{!this.state.manualFill && renderHTML(this.state.book.description)}
									{this.state.manualFill && <FormControl disabled type="text" name="description" value={this.state.book.description} onChange={this.handleChange} />}
								</Col>
							</FormGroup>}
						
							{this.state.book && this.state.book.titreBook && <FormGroup>
								<Col sm={2}>Catégorie:</Col>
								<Col sm={10}>
									{!this.state.manualFill && renderHTML(this.state.book.categorieId)}
									{this.state.manualFill && <FormControl disabled name="categorieId" componentClass="select" value={this.state.book.categorieId} placeholder="select" onChange={this.handleChange}>
										{catReact}
									</FormControl>}
								</Col>
							</FormGroup>}
							{this.state.book && this.state.book.titreBook && <FormGroup>
								<Col sm={2}>Noter ce livre</Col>
								<Col sm={10}>
									<AddAvis
										visibleByDefault={true}
										showRating={true}
										avis={this.state.avis}
										handleAvisChange={this.handleAvisChange}
									/>
								</Col>
							</FormGroup>}
							<ButtonToolbar className="text-center">
								<Button  bsStyle="primary" type="submit" onClick={this.handleSubmit}>Valider</Button>
							</ButtonToolbar>
							
						</Form>
					</Col>
					
				</div>}
				<Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button>
			</div>
		)
	}
}

export default withRouter(EditBook);
