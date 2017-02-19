import React from 'react'
import helpers from '../helpers/api'
import {withRouter} from 'react-router'
import {FormGroup} from 'react-bootstrap'
import {Col} from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'
import {Button} from 'react-bootstrap'
import {Form} from 'react-bootstrap'
import {ControlLabel} from 'react-bootstrap'
import {Link} from 'react-bootstrap'

class EditBook extends React.Component {

    constructor(props) {
        super(props);
        this.state = {book: {titreBook: '', auteur: '', description: '', isbn: '', categorieId: ''}}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.returnToBooks = this.returnToBooks.bind(this);
    }

    componentDidMount() {
        //if id passed load exising book
        if (this.props.params && this.props.params.bookId) {
            console.log('get book detail')
            helpers.getBookDetail(this.props.params.bookId).then((book) => {
                //TODO : dispatch REDUX ACTION type LOAD
                this.setState({book: book});
            })
        }

    }

    returnToBooks() {
        this.props.router.push('/my-books')
    }

    handleSubmit(event) {
        event.preventDefault();
        helpers.saveBook(this.state.book, (this.props.params.bookId) ? this.props.params.bookId : undefined).then((book) => {
            this.props.router.push('/my-books')
        });

    }

    handleChange(event) {
        const book = this.state.book;
        book[event.target.name] = event.target.value;
        this.setState({book: book});
    }

    render() {
        let catJson = document.getElementById("categories").value;
        let cat = JSON.parse(catJson);
        const catReact = cat.map(category => {
            return <option value={category.id}>{category.name}</option>
        });

        return (
            <div className="main-content">
                <div className="edit-book-container">
                    <h2>Veuillez indiquer les informations du livre</h2>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} sm={3}>
                                titre:
                            </Col>
                            <Col sm={5}>
                                <FormControl type="text" name="titreBook" value={this.state.book.titreBook}
                                             onChange={this.handleChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                auteur:
                            </Col>
                            <Col sm={5}>
                                <FormControl type="text" name="auteur" value={this.state.book.auteur}
                                             onChange={this.handleChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                description:
                            </Col>
                            <Col sm={5}>
                                <FormControl type="text" name="description" value={this.state.book.description}
                                             onChange={this.handleChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                isbn:
                            </Col>
                            <Col sm={5}>
                                <FormControl type="text" name="isbn" value={this.state.book.isbn}
                                             onChange={this.handleChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Catégorie
                            </Col>
                            <Col sm={5}>
                                <FormControl name="categorieId" value={this.state.book.categorieId} onChange={this.handleChange}
                                             componentClass="select" placeholder="select">
                                    {catReact}
                                </FormControl>
                            </Col>
                        </FormGroup>

                        <Button bsStyle="primary" onClick={this.returnToBooks}>Retour</Button>
                        <Button bsStyle="primary" type="submit" >Valider</Button>
                    </Form>
                </div>
            </div>
        )
    }


}

export default withRouter(EditBook);
