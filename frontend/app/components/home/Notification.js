import React from 'react';
import { Link } from 'react-router';

class Notification extends React.Component {
	constructor(props) {
		super(props);
		this.refresh = this.refresh.bind(this)
	}

	refresh() {
		this.props.onRefreshNotification();
	}

	render() {

		//nouvel ami
		let requestFriends = "";
		if (this.props.requestedFriends.length > 0) {
			requestFriends = <div className="alert alert-warning" onClick={this.refresh}>
				<h6>Nouvelle demande d'amis!</h6>
				<p><Link to={'/my-requested-friends'}>Vous avez un ou de nouveaux amis!</Link></p>
			</div>
		}

		return (
			<div className="notification-container">
				{requestFriends}

				{this.props.isNewPret && (
					<div className="alert alert-warning" onClick={this.refresh}>
						<h6>Nouveau prêt</h6>
						<p><Link to={'/my-lendings'}>Vous avez une nouvelle demande de prêt!</Link>
						</p>
					</div>)
				}
			</div>
		)
	}
}

export default Notification
