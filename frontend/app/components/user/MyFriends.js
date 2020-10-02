import React from 'react'
import helpers from '../../helpers/friend/api'
import AddFriend from './AddFriend'
import MyFriend from './MyFriend'
import PendingFriend from './PendingFriend'

import './MyFriends.scss'

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
    this.props.displaySpinner();
		helpers.getMyFriends().then((friends) => {
      this.props.hideSpinner()
			this.setState({
				friends: friends
			});
		});

    this.props.displaySpinner();
		helpers.getMyPendingFriends().then((friends) => {
      this.props.hideSpinner()
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
    this.props.displaySpinner();
		helpers.deleteFriend(id).then((result) => {
      this.props.hideSpinner()
			if (result == '0') {
				this.setState({ showModal: true })
			}
			else {
				this.componentDidMount();
			}
		});
	}

	deletePendingFriend(id) {
    this.props.displaySpinner();
		helpers.deletePendingFriend(id).then(() => {
      this.props.hideSpinner()
			this.componentDidMount();
		});
	}

	savePendingFriend(email) {
    this.props.displaySpinner();
		return helpers.savePendingFriend(email).then(() => {
      this.props.hideSpinner()
			this.componentDidMount();
		})
	}

	render() {
		const friends = this.state.friends.map(friend => {
			return <MyFriend key={friend.id}
			 								 id={friend.id}
											 friend={friend}
                      //  deleteFriend={this.deleteFriend}
                        />
		});

		const pendingFriends = this.state.pendingFriends.map(pendingfriend => {
			return <PendingFriend friend={pendingfriend}
                            deletePendingFriend={this.deletePendingFriend}
                            displaySpinner={this.props.displaySpinner}
                            hideSpinner={this.props.hideSpinner}
                            
                            
              />
    });

		return (
      <>
      <section>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col d-flex flex-wrap justify-content-center">
				      {friends.length == 0 && <span>Vous n'avez pas d'amis.</span>}
				      {friends.length > 0 && <div><h2>Mes amis</h2> <div className="friends-container">{friends}</div></div>}
				      
              {/* <Modal show={this.state.showModal} onHide={this.closeModal}>
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
              </Modal> */}
            </div>
          </div>
          <div className="row justify-content-center">
           <div className="col d-flex flex-wrap justify-content-center">
              <h2>Inviter une connaissance à rejoindre Livres entre Amis!</h2>
              <div className="friends-container">{pendingFriends}</div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col d-flex flex-wrap justify-content-center">
            <AddFriend onRefreshNotification={this.props.onRefreshNotification} savePendingFriend={this.savePendingFriend}/>
          </div>
        </div>
      </section>
      </>
		)
	}
}

export default MyFriends
