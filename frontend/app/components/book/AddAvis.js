import React from 'react'
import Rating from 'react-rating'
import helpers from '../../helpers/book/api'
import { Button } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import { SVGIcon } from '../common/SVGIcon'
import Header from '../home/Header';

class AddAvis extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			avis: this.props.avis || {},
			visibleByDefault: this.props.visibleByDefault,
			displayToggle: this.props.displayToggle || false,
			showRating: this.props.showRating || false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRating = this.handleRating.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ avis: nextProps.avis || {} })
	}

	handleRating(event) {
		const newAvis = this.state.avis || {};
		newAvis["note"] = event;
		if (this.props.handleAvisChange) {
			this.props.handleAvisChange(newAvis)
		} else {
			this.setState({ avis: newAvis });
		}
	}

	handleMessageChange(event) {
		const newAvis = this.state.avis || {};
		newAvis["libelle"] = event.target.value;
		if (this.props.handleAvisChange) {
			this.props.handleAvisChange(newAvis)
		} else {
			this.setState({ avis: newAvis });
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		helpers.saveAvis(this.state.avis, this.props.bookId).then(() => {
			this.setState({ avis: {} });
			this.props.reloadEmprunt();
		});
	}

	toggleInput(event) {
		event.preventDefault();
		this.setState({
			showRating: !this.state.showRating,
		})
	}

	render() {
		return (
			<div className="add-avis-container">
				{!this.state.visibleByDefault &&
					<Button bsStyle="primary" onClick={this.toggleInput.bind(this)}>Ajouter un avis</Button>
				}
				{this.state.showRating && <div>
					<Rating empty={<SVGIcon href='#icon-star-empty' className='icon-rating' />}
						full={<SVGIcon href='#icon-star-full' className='icon-rating' />}
						initialRate={this.state.avis.note}
						onClick={this.handleRating} />
					<FormControl
						name="libelle"
						componentClass="textarea"
						value={(this.state.avis && this.state.avis.libelle) || ""}
						onChange={this.handleMessageChange} />
				</div>}
				{!this.props.visibleByDefault && this.state.showRating &&
					<Button onClick={this.handleSubmit} type="submit" bsStyle="primary">Valider</Button>
				}
			</div>
		)
	}
}

export default AddAvis
