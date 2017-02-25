import React from 'react'
import helpers from '../helpers/api'
import Book from './Book'
import {Button} from 'react-bootstrap'
import {withRouter} from 'react-router'

class UserDetail extends React.Component{

    constructor(props) {
        super(props);
        this.state = {books: [], pendingFriends: [], firstUser: ''};
        this.returnToPreviousPage = this.returnToPreviousPage.bind(this);
    }

    //need to request server to get friend's books
    componentDidMount() {


    }

    componentWillReceiveProps(){
        helpers.getUserDetail(this.props.params.userId).then((books) => {
            this.setState({firstUser: books[0].preteur});
            // this.setState({books: books})
            let allBooks = books;
            //my pending friends to see if user added and display adequate sentence
            helpers.getMyPendingFriends().then((pf) => {
                // this.setState( {books: allBooks, pendingFriends: pf });
                let pending = pf;
                //my friends to see if user added and display adequate sentence
                helpers.getMyFriends().then((friends) => {
                    this.setState( {books: allBooks, pendingFriends: pending });
                });
            });
        });
    }

    returnToPreviousPage(){
        if(this.props.params.previousPage == 'listBook'){
            this.props.router.push('/list-book')
        }
        else
        if (this.props.params.previousPage == 'myFriend'){
            this.props.router.push('/my-friends')
        }
        else{ // requestedFriend
            this.props.router.push('/my-requested-friends');
        }
    }

    render(){

        let books = this.state.books.map( book => {
            return <Book key={book.id} id={book.id} book={book} previousPage="userDetail" pendingFriends={this.state.pendingFriends} />
        });

        //add sub friend books
        /*
        this.state.user.userFriends.map( user => {
            return user.livres.map(livre => {
                books.push(<Book proprietaire={user.fullName} key={livre.id} id={livre.id} book={livre} previousPage="userDetail" />);
            })
        });
        */

        return(
            <div className="container">
                <h1>Livres de {this.state.firstUser} et ses amis</h1>
                {books.length == 0 && <span>Cet utilisateur n'a pas encore de livres.</span>}
                {books.length >0 && <div className="book-container">{books}</div>}
                <Button bsStyle="primary" onClick= {this.returnToPreviousPage}>Retour</Button>
            </div>
        )
    }
}

export default withRouter(UserDetail);
