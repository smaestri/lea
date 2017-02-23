import React from 'react'
import helpers from '../helpers/api'
import Book from './Book'
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import { withRouter } from 'react-router';

class MyBooks extends React.Component{

    constructor(props) {
        super(props);
        this.state = {books:[]};
        this.handleDelete = this.handleDelete.bind(this);
        this.addBook = this.addBook.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount(){
        helpers.getMyBooks().then((books) => {
            this.setState({
                books: books,
                showModal: false
            });
        });
    }

    addBook(){
        this.props.router.push('/edit-book')
    }

    handleDelete(event, idBook) {
        event.preventDefault();
        helpers.deleteBook(idBook).then( (data) => {
            if(data == "0"){
                this.setState({showModal: true});
            }
            else{
                this.componentDidMount();
            }
        })
    }

    close(){
        this.setState({ showModal: false });
    }

    render(){
        const books = this.state.books.map( book => {
            return <Book key={book.id} id={book.id} book={book} handleDelete={this.handleDelete} previousPage="myBooks"/>
        });
        return(
            <div className="container">
                <h1>Ma bibiliothèque</h1>
                {books.length == 0 && <span>Vous n'avez pas de livres.</span>}
                {books.length >0 && <div className="book-container">{books}</div>}
                <Button bsStyle="primary" bsSize="small" onClick={this.addBook}>Ajouter livre</Button>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Livre en cours d'emprunt</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Ce livre est en cours d'emprunt par un utilisateur. Veuillez clore ce prêt afin de supprimer ce livre!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default withRouter(MyBooks)
