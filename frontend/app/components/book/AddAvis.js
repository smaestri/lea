import React from 'react'
import Rating from 'react-rating'
import helpers from '../../helpers/api'
import { Button } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import formatDate from '../../helpers/utils'
import { SVGIcon } from '../../helpers/api'

class AddAvis extends React.Component {

	constructor(props) {
		super(props);
		this.state = { avis: this.props.avis || {}, showInput: this.props.showInput || false };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRating = this.handleRating.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);
	}

	handleRating(event) {
		const newAvis = this.state.avis || {};
		newAvis["note"] = event;
		if (this.props.updateAvis) {
			this.props.updateAvis(newAvis)
		} else {
			this.setState({ avis: newAvis });
		}
	}

	handleMessageChange(event) {
		const newAvis = this.state.avis || {};
		newAvis["libelle"] = event.target.value;
		if (this.props.updateAvis) {
			this.props.updateAvis(newAvis)
		} else {
			this.setState({ avis: newAvis });
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		helpers.saveAvis(this.state.avis, this.props.bookId).then(() => {
			this.setState({ avis: '' });
			this.props.reloadEmprunt();
		});
	}

	toggleInput(event) {
		event.preventDefault();
		this.setState({ showInput: !this.state.showInput })
		if (this.props.updateAvis && !this.state.showInput) {
			this.props.updateAvis(undefined)
		}
	}

	render() {
		return (
			<div className="add-avis-container">
				{!this.props.updateAvis &&
					<Button bsStyle="primary" onClick={this.toggleInput.bind(this)}>Ajouter un avis</Button>}
				{this.state.showInput && <div>
					<Rating empty={<SVGIcon href='#icon-star-empty' className='icon-rating' />}
						full={<SVGIcon href='#icon-star-full' className='icon-rating' />}
						initialRate={this.state.avis.note}
						onClick={this.handleRating} />
					<FormControl
						name="libelle"
						componentClass="textarea"
						value={(this.state.avis && this.state.avis.libelle) || ""}
						onChange={this.handleMessageChange} />
					{!this.props.updateAvis &&
						<Button onClick={this.handleSubmit} type="submit" bsStyle="primary">Valider</Button>}
				</div>}
			</div>
		)
	}
}

export default AddAvis
