import React from 'react'
import helpers from '../helpers/api'
import Book from './Book'

class UserDetail extends React.Component{

    constructor(props) {
        super(props);
        this.state = {user:[]};
    }

    componentDidMount() {
        helpers.getUserDetail(this.props.params.userId).then((newUser) => {
            this.setState({user: newUser})
        });
    }

    render(){
        const books = this.state.user.map( book => {
            return <Book key={book.id} id={book.id} titreBook={book.titreBook} />
        });

        return(
            <div>
                <h1>Livres de {this.state.user.fullName}</h1>
                <ul>{books}</ul>
            </div>
        )
    }
}

export default UserDetail
