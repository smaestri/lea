import React from 'react'
import {Link} from 'react-router'
import {Button} from 'react-bootstrap'

class MyFriend extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="friend">
                <div className="imageUser">
                    <Link to={'user-detail/' + this.props.friend.id + '/myFriend'}>
                        <img src={this.props.friend.avatar} />
                    </Link>
                </div>
                <div className="linkUser">
                    <Link to={'user-detail/' + this.props.friend.id + '/myFriend' }>
                        {this.props.friend.fullName}
                    </Link>
                </div>
                <div className="linkUser">
                    <Button bsStyle="primary" bsSize="small" onClick={() => this.props.deleteFriend(this.props.friend.id)}>Supprimer</Button>
                </div>
            </div>
        )
    }
}

export default MyFriend
