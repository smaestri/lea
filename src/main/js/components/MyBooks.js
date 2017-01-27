import React from 'react'
import helpers from '../helpers/api'
import MyBook from './MyBook'
import Button from 'react-bootstrap/lib/Button';
import { withRouter } from 'react-router';
import '../../webapp/assets/css/book.scss';

class MyBooks extends React.Component{

    constructor(props) {
        super(props);
        this.state = {books:[]};
        this.handleDelete = this.handleDelete.bind(this);
        this.addBook = this.addBook.bind(this);
    }

    componentDidMount(){
        helpers.getMyBooks().then((books) => {
            this.setState({
                books: books
            });
        });
    }

    addBook(){
        this.props.router.push('/edit-book')
    }

    handleDelete(event, idBook) {
        event.preventDefault();
        helpers.deleteBook(idBook).then(() => {
            this.componentDidMount();
        })
    }

    render(){
        const books = this.state.books.map( book => {
            return <MyBook key={book.id} id={book.id} book={book}handleDelete={this.handleDelete} />
        });
        return(
            <div className="books-container">
                <h1>Ma bibiliothèque</h1>
                <div className="book-container">
                    {books}
                </div>
                <Button bsStyle="primary" bsSize="small" onClick={this.addBook}>Ajouter livre</Button>
            </div>
        )
    }
}

export default withRouter(MyBooks)
