import React from 'react'
import LastAvis from './LastAvis'
import ListCategories from './ListCategories'

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = { avis: [] };
	}

	render() {
		return (
			<div className="container" id="main">
				<div className="tagline">
					Bienvenue sur <strong>Livres entre amis</strong>, partagez vos livres .... entre
					amis!<br />
					<span className="fleuron"></span>
				</div>
				<div className="row">
					<LastAvis />
					<ListCategories />
				</div>
			</div>);
	}
}

export default Home