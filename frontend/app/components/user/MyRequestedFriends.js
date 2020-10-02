import React from 'react'
import { Redirect } from 'react-router-dom'
import helpersFriend from '../../helpers/friend/api'
import { withRouter } from 'react-router'
import PendingFriend from './PendingFriend'

class MyRequestedFriends extends React.Component {

	constructor(props) {
		super(props);
		this.state = { requestedFriends: [], redirectToMyFriends: false, disableSubmit: false };
		this.acceptRequestFriend = this.acceptRequestFriend.bind(this);
	}

	componentDidMount() {
    this.props.displaySpinner()
		helpersFriend.getMyRequestedFriends().then((friends) => {
      this.props.hideSpinner()
			this.setState({
				requestedFriends: friends
			});
		});
	}

	acceptRequestFriend(id) {
    this.props.displaySpinner()
		this.setState({disableSubmit: true})
		helpersFriend.acceptFriend(id).then(() => {
      this.props.hideSpinner()
			this.props.onRefreshNotification();
			this.componentDidMount();
			this.setState({ redirectToMyFriends: true, disableSubmit: false});
		})
	}

	render() {
		if(this.state.redirectToMyFriends) {
			return <Redirect to='/my-friends'/>;
		}
		const requestedFriends = this.state.requestedFriends.map(friend => {
			return <PendingFriend
						showAcceptButton={true}
						friend={friend}
						acceptRequestFriend={this.acceptRequestFriend}/>;
		});

		return (
			<div className="requested-container">
				<h2>Mes demande d'amis</h2>
				{requestedFriends.length == 0 && <span>Vous n'avez pas d'amis à confirmer.</span>}
				{requestedFriends.length > 0 &&
				<span>Vous trouverez ci-dessous les personnes qui vous ont ajoutée en tant qu'ami; Si vous connaissez cette, personne, acceptez-la, et partagez vos livres et les siens!</span>}
				{requestedFriends.length > 0 &&
				<div className="friend-container">{requestedFriends}</div>}
			</div>
		)
	}
}

export default withRouter(MyRequestedFriends)
