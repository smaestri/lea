import React from 'react';
import { withRouter } from 'react-router';
import Button from 'react-bootstrap/lib/Button';

import '../../assets/css/searchbar.scss';

class SearchBar extends React.Component{


    constructor(props) {
        super(props);
        this.searchBook = this.searchBook.bind(this);
    }

    searchBook() {
        this.props.router.push('/list-book')
    }

    render(){
        return(
            <div className="searchbar-container">
                <input className="search-bar" type="text" placeholder="Indiquez le titre d'un livre, auteur, etc à emprunter" />
                <Button bsStyle="primary" onClick={this.searchBook}>Rechercher</Button>
            </div>
        )
    }
}

export default withRouter(SearchBar);
