import React from 'react'
import Rating from 'react-rating'
import helpers from '../helpers/api'
import { Button } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import formatDate from '../helpers/utils'
import { SVGIcon } from '../helpers/api'

class AddAvis extends React.Component {

	constructor(props) {
		super(props);
		this.state = { editMode: props.avis ? true : false, avis: props.avis };
		this.handleRating = this.handleRating.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);
		//this.saveAvis = this.saveAvis.bind(this);
		this.saveEditAvis = this.saveEditAvis.bind(this);
		this.deleteAvis = this.deleteAvis.bind(this);
		this.toggleEditmode = this.toggleEditmode.bind(this);
		this.undoEdit = this.undoEdit.bind(this);
	}

	toggleEditmode() {
		this.setState({
			editMode: !this.state.editMode
		});
	}

	handleRating(event) {
		const newAvis = this.props.avis;
		newAvis["note"] = event;
		this.setState({ avis: newAvis });
		this.props.updateAvis(newAvis)
	}

	handleMessageChange(event) {
		const newAvis = this.props.avis;
		newAvis["libelle"] = event.target.value;
		this.setState({ avis: newAvis });
		this.props.updateAvis(newAvis)
	}

	saveEditAvis() {
		helpers.saveAvis(this.props.avis, this.props.avis.id, this.props.bookId).then(() => {
			this.setState({ editMode: false });
		});
	}

	deleteAvis() {
		helpers.deleteAvis(this.props.avis.id).then(() => {
			this.setState({ avis: {}, editMode: true });
		});
	}

	undoEdit() {
		this.setState({
			editMode: false
		});
	}

	render() {
		let showTextArea = false;
		// create mode
		if (this.props.avis) {
			showTextArea = true;
		}
		else {
			if (this.state.editMode) {
				showTextArea = true;
			}
		}
		let dateAvis;
		if (this.props.avis.dateavis) {
			dateAvis = formatDate(this.props.avis.dateavis);
		}

		return (
			<div className="avis-container">
				<h3>Noter ce livre</h3>
				<div className="avis-content">
					{dateAvis && <div>Ajouté le {dateAvis}</div>}
					<div className="avis-note">
						<label>Note: </label>
						<Rating empty={<SVGIcon href='#icon-star-empty' className='icon-rating'/>}
						        full={<SVGIcon href='#icon-star-full' className='icon-rating'/>}
						        readonly={!showTextArea}
						        initialRate={this.props.avis.note}
						        onClick={this.handleRating}/>
					</div>
					<div className="avis-txt">
						<label>Message: </label>{!showTextArea && <span><blockquote>{this.props.avis.libelle}</blockquote></span>}
						{ showTextArea && <FormControl name="libelle" componentClass="textarea"
						                               onChange={this.handleMessageChange}
						                               value={this.props.avis.libelle}/>}
					</div>
				</div>
				<div className="avis-buttons">
					{this.props.allowModification && !this.state.editMode &&
					<Button bsStyle="primary" bsSize="small"
					        onClick={this.toggleEditmode}>Modifier</Button>}
					{this.props.allowModification && !this.state.editMode &&
					<Button bsStyle="primary" bsSize="small"
					        onClick={this.deleteAvis}>Supprimer</Button>}
					{this.props.allowModification && this.state.editMode &&
					<Button bsStyle="primary" bsSize="small"
					        onClick={this.undoEdit}>Annuler</Button>}
					{this.props.allowModification && this.state.editMode &&
					<Button bsStyle="primary" bsSize="small"
					        onClick={this.saveEditAvis}>Sauvegarder</Button>}
				</div>
			</div>
		)
	}
}

export default AddAvis
