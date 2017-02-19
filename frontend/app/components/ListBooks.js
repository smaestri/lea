import React from 'react'
import helpers from '../helpers/api'
import Book from './Book'
import '../../assets/css/book.scss'

class ListBooks extends React.Component{

    constructor(props) {
        super(props);
        this.state = {books:[], pendingFriends: []};
    }

    componentDidMount(){
        let allBooks  = [];
        let myPendingFriends = [];
        helpers.getAllBooks().then((books) => {
            allBooks = books;

            //my pending friends to see if user added and display adequate sentence
            helpers.getMyPendingFriends().then((pf) => {
                let pending = pf;

                //my friends to see if user added and display adequate sentence
                helpers.getMyFriends().then((friends) => {
                    this.setState( {books: allBooks, friends: friends, pendingFriends: pending });
                });

            });
        });

    }

    render(){
        const books = this.state.books.map( book => {
            return <Book key={book.id} id={book.id} book={book} previousPage="listBook" pendingFriends={this.state.pendingFriends} />
        });

        return(
            <div className="main-content">
                <h1>Livres empruntables</h1>
                {books.length == 0 && <span>Pas de livres empruntables.</span>}
                {books.length >0 && <div className="book-container">{books}</div>}
            </div>
        )
    }

}

export default ListBooks
