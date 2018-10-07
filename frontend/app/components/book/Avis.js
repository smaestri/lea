import React from 'react'
import Rating from 'react-rating'
import { Link } from 'react-router'
import helpers from '../../helpers/user/api'
import formatDate from '../../helpers/utils'
import { SVGIcon } from '../common/SVGIcon'
import style from './Avis.scss'

class Avis extends React.Component {

	static defaultProps = {
		displayImage: true
	  }

	constructor(props) {
		super(props);
		this.state = { avis: {} };
	}

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
			<div className='container-avis'>
				<div className="title-book">
					<p>{this.state.avis.livre}</p>
				</div>
				<div className="avis-livre">
					{this.props.displayImage && <div className="image-container">
						<div className="image-content">
							<img className="img" src={this.state.avis.image}/>
						</div>
					</div> }
					<div className='avis-infos'>
						<div>Ajouté le <b>{dateAvis}</b> par <b>{this.state.avis.auteur}</b> :</div>
						<div>
							<Rating empty={<SVGIcon href='#icon-star-empty' className='icon-rating'/>}
									full={<SVGIcon href='#icon-star-full' className='icon-rating'/>}
									readonly={true}
									initialRate={this.state.avis.note}/>
						</div>
						<div>
							<blockquote>{this.state.avis.libelle}</blockquote>
						</div>
					</div>
				</div>
			</div>)

	}
}

export default Avis
