import React from 'react';
import { Link } from 'react-router';

import '../../webapp/assets/css/searchbar.scss';

class Notification extends React.Component{


    constructor(props) {
        super(props);
    }

    render(){
        console.log('this.props.requestedFriends' )
        console.log(this.props.requestedFriends )

        //nouvel ami
        const req = this.props.requestedFriends.map( () => {
            return <li><Link to={'/my-requested-friends'}>Vous avez une nouvelle demande d'amis!</Link></li>
        })

        return(
            <div className="notification-container">
                <ul>
                    {req}
                </ul>
            </div>
        )
    }
}

export default Notification
