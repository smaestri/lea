import React from 'react'
import LastAvis from './LastAvis'
import ListCategories from './ListCategories'
import style from './Home.scss'
import Header from './Header';
import Footer from './Footer';

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = { avis: [] };
	}

	render() {
		return (
			<div>
				<div className='home-container'>
					<div className='container-header-step'>
						<div className='title-txt'>
							<h1>Bienvenue sur Livres entre amis, partagez vos livres ... entre	amis!</h1>
						</div>
					</div>
					<div className='container-content-step'>
						<div className='step'>
							<div className='step-image'>
								<img src="/webjars/app-react/1.0.0/img/2-askbook.jpg" />
							</div>
							<div className='step-txt'>1 - Recherchez un livre qui vous intéresse et faites une demande d'emprunt</div>
							
						</div>
						<div className='step'>
							<div className='step-image'>
								<img src="/webjars/app-react/1.0.0/img/4-readbook.jpg" />
							</div>
							<div className='step-txt'>2 - Le propriétaire valide l'emprunt et il devient votre ami. Savourez votre livre!</div>
						</div>
						<div className='step'>
							<div className='step-image'>
								<img src="/webjars/app-react/1.0.0/img/3-accept-book.jpg" />
							</div>
							<div className='step-txt'>3 - Retournez le livre à son propriétaire une fois lu!</div>
						</div>
					</div>
					<div className='container-actu'>
						<LastAvis />
						<ListCategories />
					</div>
				
				</div>
			</div>);
	}
}

export default Home
