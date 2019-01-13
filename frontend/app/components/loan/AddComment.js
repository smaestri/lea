import React from 'react'
import { FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import helpers from '../../helpers/loan-actions/api'
import style from './AddComment.scss'

class AddComment extends React.Component {

	constructor(props) {
		super(props);
		this.state = { comm: '', showInput: false, disableAddCommentButton: false };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		this.setState({ disableAddCommentButton: true });
		helpers.saveComment(this.state.comm, null, this.props.idLoan).then(() => {
			this.setState({ comm: '', showInput: false });
			this.props.reloadEmprunt();
			this.setState({ disableAddCommentButton: true });
		});
	}

	handleChange(event) {
		this.setState({ comm: event.target.value });
	}

	toggleInput() {
		this.setState({ showInput: !this.state.showInput })
	}

	render() {
		return (
			<div className="add-comment-container">
				<Button bsStyle="primary" onClick={this.toggleInput.bind(this)}>Discuter avec {this.props.destinataire}</Button>
				{this.state.showInput && <div className="bloc-input-comm">
					<span>Veuillez entrer un message à l'attention de {this.props.destinataire}.</span>
					<FormControl name="message" componentClass="textarea" onChange={this.handleChange} value={this.state.comm} />
					<Button onClick={this.handleSubmit} type="submit" disabled={this.state.disableAddCommentButton} bsStyle="primary" bsSize="small">Valider</Button>
				</div>}
			</div>
		)
	}
}

export default AddComment
