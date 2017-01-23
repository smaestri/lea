import React from 'react'
import helpers from '../helpers/api'
import AddFriend from './AddFriend'
import MyFriend from './MyFriend'

class MyFriends extends React.Component {

    constructor(props) {
        super(props);
        this.state = {friends: [], pendingFriends:[]};
        this.savePendingFriend = this.savePendingFriend.bind(this);
    }

    componentDidMount(){

        helpers.getMyFriends().then((friends) => {
            this.setState({
                friends: friends
            });
        });

        helpers.getMyPendingFriends().then((friends) => {
            this.setState({
                pendingFriends: friends
            });
        });
    }

    savePendingFriend(email){
        console.log('savePendingFriend')
        helpers.savePendingFriend(email).then(() => {
            //TODO : unnecessary cal to get friends
            this.componentDidMount();
        })

    }

    render() {
        const friends = this.state.friends.map( friend => {
            return <MyFriend key={friend.id} id={friend.id} friend={friend}/>
        });

        const pendingFriends = this.state.pendingFriends.map( friend => {
            return <li>{friend}</li>
        });

        return (
            <div>
                <h2>Mes amis actifs</h2>
                <ul>{friends}</ul>
                {(friends.length == 0) && <span>pas d'amis</span>}
                <h2>mes amis en attente de confirmation</h2>
                {(pendingFriends.length == 0) && <span>pas d'amis en attente de confirmation</span>}
                <ul>{pendingFriends}</ul>
                <AddFriend savePendingFriend={this.savePendingFriend} />
            </div>
        )
    }
}

export default MyFriends
