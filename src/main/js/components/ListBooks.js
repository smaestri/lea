import React from 'react'
import helpers from '../helpers/api'
import Book from './Book'

class ListBooks extends React.Component{

    constructor(props) {
        super(props);
        this.state = {books:[]};
    }

    componentDidMount(){
        console.log('ListBooks did mount')
        const books = helpers.getAllBooks().then((books) => {
            console.log('books')
            console.log(books)
            this.setState({
                books: books
            });
        });
        //FIXME BIND NEEDED?
    }


    render(){

        console.log("render mybooks")
        const books = this.state.books.map( book => {
            return <Book key={book.id} id={book.id} titreBook={book.titreBook} />
        });

        return(
            <div>
                <h1>Livres empruntables</h1>
                <ul>{books}</ul>
            </div>
        )
    }

}

export default ListBooks
