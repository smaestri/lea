import React from 'react'
import {Link} from 'react-router'

class MyFriend extends React.Component {

    render() {
        return (
            <li>{this.props.friend.fullName} -
            </li>
        )
    }
}

export default MyFriend
