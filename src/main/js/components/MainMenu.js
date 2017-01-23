import React from 'react';
import { Link } from 'react-router'

class MainMenu extends React.Component{

    render(){

        const nbPrets = document.getElementById('nbPrets').value;
        const nbEmprunts = document.getElementById('nbEmprunts').value;

        return(
            <div>
                <ul role="nav">
                    <li><Link to="/my-books">Mes livres</Link></li>
                    <li><Link to="/my-loans">Mes emprunts ({nbEmprunts})</Link></li>
                    <li><Link to="/my-lendings">Mes prets ({nbPrets})</Link></li>
                    <li><Link to="/my-friends">Mes amis</Link></li>
                    <li><Link to="/my-requested-friends">Vous avez une demande d'amis!</Link></li>
                </ul>
            </div>
        )
    }
}

export default MainMenu
