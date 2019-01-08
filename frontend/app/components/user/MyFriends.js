import React from 'react'
import { Modal } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import helpers from '../../helpers/friend/api'
import AddFriend from './AddFriend'
import MyFriend from './MyFriend'
import PendingFriend from './PendingFriend'
import style from './MyFriends.scss'

class MyFriends extends React.Component {

	constructor(props) {
		super(props);
		this.state = { friends: [], pendingFriends: [], showModal: false };
		this.savePendingFriend = this.savePendingFriend.bind(this);
		this.deleteFriend = this.deleteFriend.bind(this);
		this.deletePendingFriend = this.deletePendingFriend.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.showModal = this.showModal.bind(this);
	}

	componentDidMount() {
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

	closeModal() {
		this.setState({ showModal: false });
	}

	showModal() {
		this.setState({ showModal: true });
	}

	deleteFriend(id) {
		helpers.deleteFriend(id).then((result) => {
			if (result == '0') {
				this.setState({ showModal: true })
			}
			else {
				this.componentDidMount();
			}
		});
	}

	deletePendingFriend(id) {
		helpers.deletePendingFriend(id).then(() => {
			this.componentDidMount();
		});
	}

	savePendingFriend(email) {
		helpers.savePendingFriend(email).then(() => {
			this.componentDidMount();
		})
	}

	render() {
		const friends = this.state.friends.map(friend => {
			return <MyFriend key={friend.id}
			 								 id={friend.id}
											 friend={friend}
			                 deleteFriend={this.deleteFriend} />
		});

		const pendingFriends = this.state.pendingFriends.map(pendingfriend => {
			return <PendingFriend friend={pendingfriend}
			                      deletePendingFriend={this.deletePendingFriend}/>
		});

		return (
			<div>
				<h2>Mes amis actifs</h2>
				{friends.length == 0 && <span>Vous n'avez pas d'amis.</span>}
				{friends.length > 0 && <div className="friends-container">{friends}</div>}
				<h2>Mes amis (attente de leur confirmation)</h2>
				{(pendingFriends.length == 0) && <span>Pas d'amis en attente de confirmation</span>}
				<div className="friends-container">{pendingFriends}</div>
				<AddFriend savePendingFriend={this.savePendingFriend}/>
				<Modal show={this.state.showModal} onHide={this.closeModal}>
					<Modal.Header closeButton>
						<Modal.Title>Impossible de supprimer cet ami</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<span>Vous ne pouvez pas supprimer cet ami car il y a des emprunts en cours avec cette personne. Veuillez les cloturer avant.</span>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.closeModal} bsStyle="primary"
						        bsSize="small">Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
}

export default MyFriends
