import React from 'react';
import { withRouter } from 'react-router';
import helpers from '../helpers/api'

class SearchBar extends React.Component{


    constructor(props) {
        super(props);
        this.searchBook = this.searchBook.bind(this);
    }

    searchBook() {
        this.props.router.push({pathname: '/list-book'})
    }

    render(){
        return(
            <div className="searchbar-container">
                <input className="search-bar" type="text" placeholder="Indiquez le titre d'un livre, auteur, etc à emprunter" />
                <button onClick={this.searchBook}>Rechercher</button>
            </div>
        )
    }
}

export default withRouter(SearchBar);
