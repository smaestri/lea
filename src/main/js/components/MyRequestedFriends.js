import React from 'react'
import helpers from '../helpers/api'

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
        console.log("acceptRequestFriend")
        console.log(event.target.attributes)
        helpers.acceptFriend(id).then( () => {
            this.componentDidMount();
        })
    }


    render() {
        const requestedFriends = this.state.requestedFriends.map( friend => {
            //TO STUDY
            return <div><span>{friend.fullName}</span> - <button onClick={()=>{this.acceptRequestFriend(friend.id)}}>Accepter</button></div>
        });

        return (
            <div>
                <h2>Mes amis a confirmer</h2>
                <ul>{requestedFriends}</ul>
                {(requestedFriends.length == 0) && <span>pas d'amis a confirmer</span>}
            </div>
        )
    }
}

export default MyRequestedFriends
