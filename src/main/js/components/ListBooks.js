import React from 'react'
import helpers from '../helpers/api'
import Book from './Book'
import '../../webapp/assets/css/book.scss'

class ListBooks extends React.Component{

    constructor(props) {
        super(props);
        this.state = {books:[]};
    }

    componentDidMount(){
        helpers.getAllBooks().then((books) => {
            this.setState({
                books: books
            });
        });
    }


    render(){
        const books = this.state.books.map( book => {
            return <Book key={book.id} id={book.id} book={book} />
        });

        return(
            <div className="books-container">
                <h1>Livres empruntables</h1>
                <div className="book-container">{books}</div>
            </div>
        )
    }

}

export default ListBooks
