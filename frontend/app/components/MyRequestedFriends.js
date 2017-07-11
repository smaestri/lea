import React from 'react'
import helpers from '../helpers/api'
import { withRouter } from 'react-router'
import PendingFriend from './PendingFriend'

class MyRequestedFriends extends React.Component {

	constructor(props) {
		super(props);
		this.state = { requestedFriends: [] };
		this.acceptRequestFriend = this.acceptRequestFriend.bind(this);
	}

	componentDidMount() {
		helpers.getMyRequestedFriends().then((friends) => {
			this.setState({
				requestedFriends: friends
			});
		});
	}

	acceptRequestFriend(id) {
		helpers.acceptFriend(id).then(() => {
			this.props.onRefreshNotification();
			this.componentDidMount();
			this.props.router.push('/my-friends')
		})
	}

	render() {
		const requestedFriends = this.state.requestedFriends.map(friend => {
			return <PendingFriend showAcceptButton={true} friend={friend}
			                      acceptRequestFriend={this.acceptRequestFriend}/>;
		});

		return (
			<div className="container">
				<h2>Mes demande d'amis</h2>
				{requestedFriends.length == 0 && <span>Vous n'avez pas d'amis à confirmer.</span>}
				{requestedFriends.length > 0 &&
				<span>Vous trouverez ci-dessous les personnes qui vous ont ajoutée en tant qu'ami; Si vous connaissez cette, personne, acceptez-l et partagez vos livres et les siens!</span>}
				{requestedFriends.length > 0 &&
				<div className="friend-container">{requestedFriends}</div>}
			</div>
		)
	}
}

export default withRouter(MyRequestedFriends)
