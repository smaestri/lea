import React from 'react'
import Rating from 'react-rating'
import { Button } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import { SVGIcon } from '../common/SVGIcon'

/**
 * Dumb component that display rating + txt
 * Callback functions when changing
 */
class EditAvis extends React.Component {

	constructor(props) {
		super(props);
		this.handleRating = this.handleRating.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);
	}

	handleRating(event) {
		const newAvis =  Object.assign({}, this.props.avis);
		newAvis["note"] = event;
		this.props.handleEditAvisChange(newAvis);
	}

	handleMessageChange(event) {
		const newAvis = Object.assign({}, this.props.avis);
		newAvis["libelle"] = event.target.value;
		this.props.handleEditAvisChange(newAvis);
	}

	render() {
		return (
			<div className="add-comment-container">
				<Rating empty={<SVGIcon href='#icon-star-empty' className='icon-rating'/>}
								full={<SVGIcon href='#icon-star-full' className='icon-rating'/>}
								initialRate={this.props.avis.note}
								readonly={!this.props.avis.editMode}
								onClick={this.handleRating} />
				{!this.props.avis.editMode && <span>{this.props.avis.libelle}</span>}
				{this.props.avis.editMode && <FormControl
					value={this.props.avis.libelle}
					name="libelle"
					componentClass="textarea"
					onChange={this.handleMessageChange} />}
			</div>
		)
	}
}

export default EditAvis
