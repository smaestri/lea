import React from 'react'
import {Link} from 'react-router'

class MyFriend extends React.Component {

    render() {
        return (
            <li><Link to={'user-detail/' + this.props.friend.id }>{this.props.friend.fullName}</Link>
            </li>
        )
    }
}

export default MyFriend
