import React from 'react'
import LastAvis from './LastAvis'
import ListCategories from './ListCategories'
import  './Home.scss'

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = { avis: [] };
	}

	render() {
		return (
			<div className='home-container'>
				<div className='container-header-step'>
					<div className='title-txt'>
						<h1>Bienvenue sur Livres entre amis, partagez vos livres ... entre	amis!</h1>
					</div>
				</div>
				<div className='container-actu'>
					<LastAvis />
					<ListCategories />
				</div>
			</div>);
	}
}

export default Home
