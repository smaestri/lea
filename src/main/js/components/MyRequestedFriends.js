import React from 'react'
import helpers from '../helpers/api'
import { withRouter } from 'react-router'
import {Button} from 'react-bootstrap'

class MyRequestedFriends extends React.Component {

    constructor(props) {
        super(props);
        this.state = {requestedFriends: [] };
    }

    componentDidMount(){
        helpers.getMyRequestedFriends().then((friends) => {
            this.setState({
                requestedFriends: friends
            });
        });
    }

    acceptRequestFriend(id){
        helpers.acceptFriend(id).then( () => {
            //freresh notification
            this.props.onRefreshNotification();
            this.componentDidMount();
            //redirect to my friends
            this.props.router.push('/my-friends')
        })
    }


    render() {
        const requestedFriends = this.state.requestedFriends.map( friend => {
            return <div><span>{friend.fullName}</span> - <Button bsStyle="primary" bsSize="small" onClick={()=>{this.acceptRequestFriend(friend.id)}}>Accepter</Button></div>
        });

        return (
            <div className="main-content">
                <h2>Mes amis à confirmer</h2>
                <ul>{requestedFriends}</ul>
                {(requestedFriends.length == 0) && <span>Pas d'amis a confirmer</span>}
            </div>
        )
    }
}

export default withRouter(MyRequestedFriends)
