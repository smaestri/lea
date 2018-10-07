import React from 'react';
import { Link } from 'react-router-dom';
import style from './Notification.scss'

class Notification extends React.Component {
	constructor(props) {
		super(props);
		this.refresh = this.refresh.bind(this)
	}

	refresh() {
		this.props.onRefreshNotification();
	}

	render() {
		let requestFriends = "";
		if (this.props.requestedFriends.length > 0) {
			requestFriends = <div onClick={this.refresh}>
				<div className="alert alert-info"><Link to={'/my-requested-friends'}>Vous avez un ou de nouveaux amis!</Link></div>
			</div>
		}

		return (
			<div className="notification-container">
				{requestFriends}

				{this.props.isNewPret && (
					<div onClick={this.refresh}>
						<div className="alert alert-info"><Link to={'/my-lendings'}>Vous avez une nouvelle demande de prêt!</Link></div>
					</div>)
				}
			</div>
		)
	}
}

export default Notification
