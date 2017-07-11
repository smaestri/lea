import React from 'react'
import { FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import formatDate from '../helpers/utils'

class Comment extends React.Component {

	constructor(props) {
		super(props);
		this.state = { editMode: false, comm: props.message };
		this.toggleEditmode = this.toggleEditmode.bind(this);
		this.undoEdit = this.undoEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.saveEditComment = this.saveEditComment.bind(this);
		this.deleteComment = this.deleteComment.bind(this);
	}

	toggleEditmode() {
		this.setState({
			editMode: !this.state.editMode
		});
	}

	handleChange(event) {
		this.setState({ comm: event.target.value });
	}

	deleteComment() {
		this.props.deleteComment(this.props.id);
	}

	saveEditComment() {
		//event.preventDefault();
		this.props.saveEditComment(this.state.comm, this.props.id);
		this.setState({ editMode: false });
	}

	undoEdit() {
		this.setState({
			editMode: false
		});
	}

	render() {
		let dateMessage = formatDate(this.props.dateMessage);
		return (
			<li>
				<div className="comment-container">
					<span>Ajouté le {dateMessage} par {this.props.auteur}</span>
					{!this.state.editMode && this.props.displayButtons &&
					<Button bsStyle="primary" bsSize="small"
					        onClick={this.toggleEditmode}>Modifier</Button>}
					{!this.state.editMode && this.props.displayButtons &&
					<Button bsStyle="primary" bsSize="small"
					        onClick={this.deleteComment}>Supprimer</Button>}
					{this.state.editMode && this.props.displayButtons &&
					<Button bsStyle="primary" bsSize="small"
					        onClick={this.undoEdit}>Annuler</Button>}
					{this.state.editMode && this.props.displayButtons &&
					<Button bsStyle="primary" bsSize="small" onClick={this.saveEditComment}>Sauvegarder</Button>}
				</div>
				<div>
					{this.state.editMode && <FormControl name="message" componentClass="textarea"
					                                     onChange={this.handleChange}
					                                     value={this.state.comm}/>}
					{!this.state.editMode && <span className="txt-comment">{this.state.comm}</span>}
				</div>
			</li>
		)
	}
}

export default Comment
