import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import style from './MyFriend.scss'

class MyFriend extends React.Component {
	render() {
		return (
			<div className="container-myfriend">
				<div className="imageUser">
					<Link to={'/user-detail/' + this.props.friend.id}>
						<img src={this.props.friend.avatar}/>
					</Link>
				</div>
				<div className="linkUser">
					<Link to={'/user-detail/' + this.props.friend.id}>
						{this.props.friend.fullName}
					</Link>
				</div>
				{/* <div className="linkUser">
					<Button bsStyle="primary" bsSize="small"
					        onClick={() => this.props.deleteFriend(this.props.friend.id)}>Supprimer</Button>
				</div> */}
			</div>
		)
	}
}
export default MyFriend
