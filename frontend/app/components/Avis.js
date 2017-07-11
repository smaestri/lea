import React from 'react'
import Rating from 'react-rating'
import helpers from '../helpers/api'
import formatDate from '../helpers/utils'
import { Link } from 'react-router'

import { SVGIcon } from '../helpers/api'

class Avis extends React.Component {

	constructor(props) {
		super(props);
		this.state = { avis: {} };
	}

	// get auteur
	componentDidMount() {
		helpers.getUserInfo(this.props.avis.auteur).then((user) => {
			let avis = this.props.avis;
			avis.auteur = user.fullName;
			this.setState({ avis: avis })
		});
	}

	render() {
		let dateAvis = formatDate(this.state.avis.dateavis);
		return (
			<div>
				<div className="title-rating">
					<div className="rating-title">
						<Link className="title-livre"
						      to={'/book-detail/'}>{this.state.avis.livre}</Link>
						<img src={this.state.avis.image}/>
					</div>
					<div className="rating-date">Ajouté le <span
						className="bolded">{dateAvis}</span> par <span
						className="bolded">{this.state.avis.auteur}</span> :
					</div>
					<div className="rating-note">
						<Rating empty={<SVGIcon href='#icon-star-empty' className='icon-rating'/>}
						        full={<SVGIcon href='#icon-star-full' className='icon-rating'/>}
						        readonly={true}
						        initialRate={this.state.avis.note}/>
					</div>
				</div>
				<blockquote>{this.state.avis.libelle}</blockquote>
			</div>)

	}
}

export default Avis
