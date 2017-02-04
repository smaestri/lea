import React from 'react'
import helpers from '../helpers/api'
import {withRouter} from 'react-router';
import {FormGroup} from 'react-bootstrap';
import {Col} from 'react-bootstrap';
import {FormControl} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import {ControlLabel} from 'react-bootstrap';

class EditBook extends React.Component {

    constructor(props) {
        super(props);
        this.state = {book: {titreBook: '', auteur: '', description: '', isbn: '', categorieId: ''}}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    handleSubmit(event) {
        console.log("handleSubmit")
        console.log(this.state.book);
        event.preventDefault();
        helpers.saveBook(this.state.book, (this.props.params.bookId) ? this.props.params.bookId : undefined).then((book) => {
            console.log('redirect to my books');
            this.props.router.push('/my-books')
        });

    }

    handleChange(event) {

        const book = this.state.book;
        book[event.target.name] = event.target.value;
        console.log("set state")
        console.log(book)
        this.setState({book: book});
    }

    render() {
        let catJson = document.getElementById("categories").value;
        let cat = JSON.parse(catJson);
        const catReact = cat.map(category => {
            return <option value={category.id}>{category.name}</option>
        });

        return (
            <div>
                <h2>Veuillez indiquer les informations du livre</h2>
                <Form horizontal onSubmit={this.handleSubmit}>
                    <FormGroup controlId="formHorizontalEmail">
                        <Col componentClass={ControlLabel} sm={2}>
                            titre:
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" name="titreBook" value={this.state.book.titreBook}
                                         onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            auteur:
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" name="auteur" value={this.state.book.auteur}
                                         onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            description:
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" name="description" value={this.state.book.description}
                                         onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            isbn:
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" name="isbn" value={this.state.book.isbn}
                                         onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Catégorie
                        </Col>
                        <Col sm={10}>
                            <FormControl value={this.state.book.categorieId} onChange={this.handleChange}
                                         componentClass="select" placeholder="select">
                                {catReact}
                            </FormControl>
                        </Col>
                    </FormGroup>

                    <Button type="submit" value="Submit">Valider</Button>
                </Form>
            </div>
        )
    }


}

export default withRouter(EditBook);
