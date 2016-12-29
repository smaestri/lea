import React from 'react';
import { Link } from 'react-router'

class SearchBar extends React.Component{

    render(){
        return(
            <div>
                <Link to="/list-book">Voir les livres empruntables</Link>
            </div>
        )
    }
}

export default SearchBar
