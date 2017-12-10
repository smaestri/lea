import React from 'react'
import LastAvis from './LastAvis'
import ListCategories from './ListCategories'
import style from './Home.scss'

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = { avis: [] };
	}

	render() {
		return (
			<div className='home-container'>
				<div className='container-title'>
					<div className='title-image'>
					Image
					</div>
					<div className='title-txt'>
						Bienvenue sur <strong>Livres entre amis</strong>, partagez vos livres ... entre
						amis!<br />
					</div>
				</div>
				<div className='container-marche'>
					<div className='step'>
						Recherchez un livre qui vous intéressé et ajouter son propriétaire comme ami
					</div>
					<div className='step'>
						Effectuer une demande d'emprunt
					</div>
					<div className='step'>
						Lisez le livre et retournez le à son propriétaire une fois lu!
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
