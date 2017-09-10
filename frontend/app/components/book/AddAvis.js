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
		this.state = { avis: this.props.avis || {}, showInput: this.props.showInput || false};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRating = this.handleRating.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);
	}

	handleRating(event) {
		const newAvis = this.state.avis || {};
		newAvis["note"] = event;
		this.setState({ avis: newAvis });
	}

	handleMessageChange(event) {
		const newAvis = this.state.avis || {};
		newAvis["libelle"] = event.target.value;
		if(this.props.updateAvis){
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

	toggleInput(){
		this.setState({showInput: !this.state.showInput})
	}

	render() {
		return (
				<div className="add-avis-container">
					<button onClick={this.toggleInput.bind(this)}>Ajouter un avis</button>
					{this.state.showInput && <div>
						<Rating empty={<SVGIcon href='#icon-star-empty' className='icon-rating'/>}
										full={<SVGIcon href='#icon-star-full' className='icon-rating'/>}
										initialRate={this.state.avis.note}
										onClick={this.handleRating} />
						<FormControl
							 name="libelle"
						 	 componentClass="textarea"
							 value={(this.state.avis && this.state.avis.libelle) || ""}
	             onChange={this.handleMessageChange} />
						{!this.props.updateAvis &&
							 <Button onClick={this.handleSubmit} type="submit" bsStyle="primary" bsSize="small">Valider</Button> }
					</div>}
				</div>
		)
	}
}

export default AddAvis
