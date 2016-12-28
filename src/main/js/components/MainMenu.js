import React from 'react';
import { Link } from 'react-router'

class MainMenu extends React.Component{

    render(){
        return(
            <div>
                <ul role="nav">
                    <li><Link to="/my-books">Mes livres</Link></li>
                    <li><Link to="/my-loans">Mes emprunts</Link></li>
                    <li><Link to="/my-lendings">Mes prets</Link></li>
                </ul>
            </div>
        )
    }
}

export default MainMenu
