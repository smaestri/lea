import React from 'react';
import { Link } from 'react-router'

class TopMenu extends React.Component{

    render(){
        return(
            <div>Top menu
                <ul role="nav">
                    <li><Link to="/profile">Mon compte</Link></li>
                    <li><a href="logout">Me d&eacute;connecter</a></li>
                </ul>
            </div>
        )
    }

}

export default TopMenu
