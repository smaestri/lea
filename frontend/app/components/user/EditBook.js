import React from 'react'
import { withRouter } from 'react-router'
import {  Redirect } from 'react-router-dom'
import { Col, FormGroup, FormControl, Button, Form, ButtonToolbar } from 'react-bootstrap'
import helpersBook from '../../helpers/book/api'
import helpers from '../../helpers/api'
import AddAvis from '../book/AddAvis'
import { renderHTML} from '../../helpers/utils'

import './EditBook.scss'

class EditBook extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			book: null,
			avis: null,
			categories: null,
			displaySpinner: false,
			redirect: false,
      errors: [],
      displayPane: false,
		//	disableSubmit: !(this.props.match.params != null && this.props.match.params.bookId != null)
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
    this.handleAvisChange = this.handleAvisChange.bind(this);
    this.togglePane = this.togglePane.bind(this);
	}

	componentDidMount() {
    this.props.displaySpinner();

		helpersBook.getCategories().then((categories) => {
      this.setState({ categories, book: {...this.state.book, categorieId: categories[0].id } });
        this.props.hideSpinner();
    });
    
   
		if (this.props.match.params && this.props.match.params.bookId) {
      // this.props.displaySpinner();
			// helpersBook.getBookDetail(this.props.match.params.bookId).then((book) => {
			// 	// if user post avis on his book
			// 	if(book && book.avis && book.avis.length > 0) {
			// 		const auteurAvis = book.avis.find((avis) => {
			// 			if (this.props.userId == avis.auteur) {
			// 				return avis;
			// 			}
			// 		})
			// 		this.setState({ avis: auteurAvis});
			// 	}
      //   this.props.hideSpinner();
			// 	this.setState({ book: book});
			// })
		} else {
			this.setState({ book: { titreBook: '', auteur: '', description: '', isbn: '' } });
		}
  }
  
  togglePane(event) {
    event.preventDefault();
    this.setState({ displayPane: !this.state.displayPane });
  }

	handleSubmit(event) {
		event.preventDefault();
		//this.setState({ disableSubmit: true });
		// if edit mode, simply change avis + categorie
		// if (this.props.match.params && this.props.match.params.bookId) {
    //   // save update category andavis
    //   this.props.displaySpinner();
		// 	helpersBook.updateBook(this.state.book).then(()=> {
		// 		helpersBook.saveAvis(this.state.avis, this.state.book.id).then(()=> {
    //       this.setState({ redirect: true, disableSubmit: false });
    //       this.props.hideSpinner();
		// 		});
		// 	}, ()=>(console.log('error detected during handleSubmit')))
		// 	return;
		// }

    // first save book
    // set correct isbn
    if(this.state.book.isbn && this.state.book.isbn.length == 10) {
      this.state.book.isbn10 = this.state.book.isbn;
    }
    if(this.state.book.isbn && this.state.book.isbn.length == 13) {
      this.state.book.isbn13 = this.state.book.isbn;
    }
    this.props.displaySpinner();
		helpersBook.saveBook(this.state.book).then((response) => {
			// then save avis if state modified
       this.props.hideSpinner();
			if (this.state.avis) {
				helpersBook.saveAvis(this.state.avis, response.data.livreModel.id).then(() => {
          this.setState({ redirect: true });
				});
			} else {
				this.setState({ redirect: true});
			}
		}, 
		(response)=> {
      this.props.hideSpinner();
			if(response.data && response.data.errors && response.data.errors.length > 0) {

				let errors = [];
				response.data.errors.forEach((err) => {
					errors.push(err.defaultMessage)
				})

				this.setState({errors});
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
        this.props.displaySpinner();
				helpers.fetchBookInfoFromAmazon(event.target.value).then ( result => {
          this.props.hideSpinner();
					if(!result.data || result.data.error ) {
						alert('Livre introuvable. Veuillez saisir les informations du livre manuellement SVP.');
						this.setState({ displayPane: true});
						return;
					} else {
            this.setState({ displayPane: false});
          }
					book['auteur'] = result.data['auteur']
					book['image'] = result.data['image']
					book['titreBook'] = result.data['name']
					book['isbn'] = eventValue
					this.setState({ book, displaySpinner: false });
				}, ()=> {
					  alert('Livre introuvable. Veuillez saisir les informations du livre manuellement SVP.');
						this.setState({ displayPane: true});
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
		if (this.state.redirect) {
      window.scrollTo(0, 0);
			return <Redirect to='/my-books'/>;
		}

		let errors = [];
		if (this.state.errors) {
			errors = this.state.errors.map(err => {
				return <div className="error">{err}</div>
			});
		}

		const catReact = this.state.categories && this.state.categories.map(category => {
			return <option key={category.id} value={category.id}>{category.name}</option>
		});

		//const readonly = this.props.match.params && this.props.match.params.bookId;
		return (
    
      <section>
        <div className="container">
          <div className="row justify-content-center">
            <div className="editbook-container">
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
                    <FormGroup>
                      <Col>Isbn:</Col>
                      <Col>
                        <FormControl type="text"  name="isbn" value={this.state.book.isbn} onChange={this.handleChange} />
                      </Col>
                    </FormGroup>
                    {(!this.state.book || !this.state.book.titreBook) && <div class="custom-control custom-checkbox mr-4" onClick={this.togglePane}>
                      <input type="checkbox" class="custom-control-input" id="check-1" checked={this.state.displayPane} />
                      <label class="custom-control-label" for="check-1">Je ne connais pas l'ISBN</label>
                    </div>}
                    {((this.state.book && this.state.book.titreBook) || this.state.displayPane) && <FormGroup>
                      <Col>titre:</Col>
                      <Col>
                        {!this.state.displayPane && renderHTML(this.state.book.titreBook)}
                        {this.state.displayPane && <FormControl type="text" name="titreBook" onChange={this.handleChange} />}
                      </Col>
                    </FormGroup>}
                    
                    {((this.state.book && this.state.book.auteur) || this.state.displayPane)  && <FormGroup>
                      <Col>Auteur:</Col>
                      <Col>
                        {!this.state.displayPane && renderHTML(this.state.book.auteur)}
                        {this.state.displayPane && <FormControl type="text" name="auteur" onChange={this.handleChange} />}
                      </Col>
                    </FormGroup>}
                    {((this.state.book && this.state.book.description) || this.state.displayPane)  && <FormGroup>
                      <Col>description:</Col>
                      <Col>
                        {!this.state.displayPane && renderHTML(this.state.book.description)}
                        {this.state.displayPane && <FormControl type="text" name="description" onChange={this.handleChange} />}
                      </Col>
                    </FormGroup>}
                    {((this.state.book && this.state.book.titreBook)|| this.state.displayPane) && <FormGroup>
                      <Col>Catégorie:</Col>
                      <Col>
                        <FormControl name="categorieId" as="select" value={this.state.book.categorieId} placeholder="select" onChange={this.handleChange}>
                          {catReact}
                        </FormControl>
                      </Col>
                    </FormGroup>}
                    {/* {this.state.book && this.state.book.titreBook && <FormGroup>
                      <Col sm={3}>Noter ce livre</Col>
                      <Col sm={9}>
                        <AddAvis
                          visibleByDefault={true}
                          showRating={true}
                          avis={this.state.avis}
                          handleAvisChange={this.handleAvisChange}
                        />
                      </Col>
                    </FormGroup>} */}
                    <ButtonToolbar className="text-center">
                      <Button title="Merci de saisir un ISBN sur 10 ou 13 caractères correct SVP"
                          disabled={(this.state.book.titreBook == "")}
                          bsStyle="primary" type="submit"
                          onClick={this.handleSubmit}>Valider</Button>
                    </ButtonToolbar>
                    
                  </Form>
                </Col>
                
              </div>}
              <Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button>
            </div>
          </div>
        </div>
      </section>
		)
	}
}

export default withRouter(EditBook);
