import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import formatDate from '../../helpers/utils'

class PendingFriend extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = { friends: [], pendingFriends: [], disableSubmit: false};
	}

	handleSubmit() {
		this.setState({disableSubmit: true})
		this.props.acceptRequestFriend(this.props.friend.id).then(()=> {
			this.setState({disableSubmit: false})
		});
	}

	render() {
		return (
			<div className="container-pending-friend">
				<div className="imageUser">
					<img src="/webjars/app-react/1.0.0/img/add-friend.png"/>
				</div>
				{!this.props.showAcceptButton &&
				<div>
					<label>Email: </label><span>{this.props.friend.email}</span>
				</div>
				}
				{!this.props.showAcceptButton &&
				<div>
					<span>Vous avez ajouté cet ami {formatDate(this.props.friend.dateDemande)}</span>
				</div>
				}
				{this.props.showAcceptButton &&
				<div>
					<span>{this.props.friend.fullName}</span>
				</div>
				}

				{this.props.showAcceptButton &&
				<div>
					<label>Email: </label><span>{this.props.friend.email}</span>
				</div>
				}
				{this.props.showAcceptButton &&
				<div className="linkUser">
					<Link to={'/user-detail/' + this.props.friend.id}>Voir ses livres</Link></div>
				}
				{this.props.showAcceptButton &&
				<div className="accept-button">
					<Button bsStyle="primary" disabled={this.state.disableSubmit} bsSize="small"
					 onClick={this.handleSubmit}>Accepter</Button>
				</div>
				}
				{!this.props.showAcceptButton &&
				<div className="linkUser">
					<Button bsStyle="primary" bsSize="small"
					        onClick={() => this.props.deletePendingFriend(this.props.friend.id)}>Annuler
						ma demande</Button>
				</div>
				}
			</div>
		)
	}
}

export default PendingFriend
