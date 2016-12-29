import React from 'react'
import helpers from '../helpers/api'
import MyBook from './MyBook'
import { Link } from 'react-router'

class MyBooks extends React.Component{

    constructor(props) {
        super(props);
        this.state = {books:[]};
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        console.log('mybooks did mount')
        const books = helpers.getMyBooks().then((books) => {
            console.log('books')
            console.log(books)
            this.setState({
                books: books
            });
        });
        //FIXME BIND NEEDED?
    }


    handleDelete(event, idBook) {
        event.preventDefault();
        console.log('DEL BOOK')
        console.log(event)
        console.log(idBook)

        helpers.deleteBook(idBook).then(() => {
            //console.log('redirect DEL BOOK')
            this.componentDidMount();
        })

    }


    render(){

        console.log("render mybooks")
        const books = this.state.books.map( book => {
            return <MyBook key={book.id} id={book.id} titreBook={book.titreBook} handleDelete={this.handleDelete} />
        });

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
