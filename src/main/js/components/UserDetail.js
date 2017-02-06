import React from 'react'
import helpers from '../helpers/api'
import Book from './Book'
import '../../webapp/assets/css/book.scss'

class UserDetail extends React.Component{

    constructor(props) {
        super(props);
        this.state = {user:{ livres: []}};
    }

    //need to request server to get friend's books
    componentDidMount() {
        helpers.getUserDetail(this.props.params.userId).then((newUser) => {
            this.setState({user: newUser})
        });
    }

    render(){
        const books = this.state.user.livres.map( book => {
            return <Book key={book.id} id={book.id} book={book} previousPage="userDetail" />
        });

        return(
            <div className="main-content">
                <h1>Livres de {this.state.user.fullName}</h1>
                <div className="book-container">{books}</div>
            </div>
        )
    }
}

export default UserDetail
