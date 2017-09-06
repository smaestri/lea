import React from 'react'
import { FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

class AddFriend extends React.Component {

	constructor(props) {
		super(props);
		this.state = { emailFriend: '' };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		this.props.savePendingFriend(this.state.emailFriend);
		this.setState({ emailFriend: '' });
	}

	handleChange(event) {
		let mailToAdd = event.target.value;
		this.setState({ emailFriend: mailToAdd });
	}

	render() {
		return (
			<div className="add-friend">
				<form>
					<label>Saisir le mail de la personne à ajouter comme ami:</label>
					<div className="txt-add-friend">
						<FormControl type="text" onChange={this.handleChange}
						             value={this.state.emailFriend}/>
					</div>
					<Button bsStyle="primary" bsSize="small"
					        onClick={this.handleSubmit}>Ajouter</Button>
				</form>
			</div>
		)
	}
}

export default AddFriend
