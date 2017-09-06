import React from 'react'
import { FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import helpers from '../../helpers/api'

class AddComment extends React.Component {

	constructor(props) {
		super(props);
		this.state = { comm: '', showInput: false };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		helpers.saveComment(this.state.comm, null, this.props.idLoan).then(() => {
			this.setState({ comm: '', showInput: false });
			this.props.reloadEmprunt();
		});
	}

	handleChange(event) {
		this.setState({ comm: event.target.value });
	}

	toggleInput(){
		this.setState({showInput: !this.state.showInput})
	}

	render() {
		return (
				<div className="add-comment-container">
					<button onClick={this.toggleInput.bind(this)}>Ajouter un commentaire</button>
					{this.state.showInput && <div className="bloc-input-comm">
					<span>Veuillez entrer un message à l'attention de {this.props.destinataire}.</span>
						<FormControl name="message" componentClass="textarea"
						             onChange={this.handleChange} value={this.state.comm}/>
						<Button onClick={this.handleSubmit} type="submit" bsStyle="primary" bsSize="small">Valider</Button>
					</div>}
				</div>
		)
	}
}

export default AddComment
