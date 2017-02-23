import React from 'react';
import { Link } from 'react-router';

class Notification extends React.Component{
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this)
    }

    refresh(){
        this.props.onRefreshNotification();
    }

    render(){
        //nouvel ami
        const req = this.props.requestedFriends.map( () => {
            return <li><span onClick={this.refresh}>toto</span><Link to={'/my-requested-friends'}>Vous avez une nouvelle demande d'amis!</Link></li>
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
