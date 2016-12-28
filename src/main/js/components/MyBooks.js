import React from 'react'
import helpers from '../helpers/api'
import Book from './Book'
import { Link } from 'react-router'

class MyBooks extends React.Component{

    constructor(props) {
        super(props);
        this.state = {books:[]};
    }

    componentDidMount(){
        console.log('dis mount')
        const books = helpers.getBooks().then((books) => {
            console.log('books')
            console.log(books)
            this.setState({
                books: books
            });
        });
        //FIXME BIND NEEDED?

    }

    render(){

        const books = this.state.books.map( book => {
            return <Book key={book.id} id={book.id} titreBook={book.titreBook} />
        });

        console.log('render')
        console.log(this.state.books)

        return(
            <div>
                <h1>My Books</h1>
                <ul>{books}</ul>
                <Link to="/edit-book">Ajouter livre</Link>
            </div>
        )
    }

}

export default MyBooks
