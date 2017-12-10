import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import { withRouter } from 'react-router'
import { Link } from 'react-router'
import Rating from 'react-rating'
import helpers from '../../helpers/api'
import { SVGIcon } from '../../helpers/api'
import style from './Book.scss'

class Book extends React.Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleLoan = this.handleLoan.bind(this);
		this.modifyBook = this.modifyBook.bind(this);
		this.savePendingFriend = this.savePendingFriend.bind(this);
	}

	handleClick(e) {
		this.props.handleDelete(e, this.props.book.id);
	}

	modifyBook() {
		this.props.router.push('/edit-book/' + this.props.book.id)
	}

	handleLoan(event) {
		event.preventDefault();
		helpers.loanBook(this.props.book.id, this.props.book.intermediaireid).then(() => {
			this.props.router.push('/my-loans');
		})
	}

	savePendingFriend() {
		helpers.savePendingFriend(this.props.book.mailPreteur).then(() => {
			this.props.router.push('/my-friends');
		})
	}

	render() {

		const userConnected = this.props.userId !== 0;

		//compute book note
		let sum = 0;
		this.props.book.avis.forEach((avis) => {
			sum = sum + avis.note;
		});
		let moyenne = sum / this.props.book.avis.length;
		return (
			<div className="book-container">
				<div className="title-livre form-horizontal">{this.props.book.titreBook}</div>
				{userConnected && (this.props.previousPage == 'listBook' || this.props.previousPage == 'userDetail') &&
					<div><label className="book-preteur">Prêteur: </label>
						<Link to={'user-detail/' + this.props.book.userId + '/' + this.props.previousPage}><span>{this.props.book.preteur}</span></Link>
					</div>}
				{!userConnected && (this.props.previousPage == 'listBook' || this.props.previousPage == 'userDetail') &&
					<div><label
						className="book-preteur">Prêteur: </label><span>{this.props.book.preteur}</span>
					</div>}
				{userConnected && (!(this.props.previousPage == 'myBooks') && this.props.book.statut == 'FREE' && !this.props.book.empruntable) && !this.props.book.pending &&
					<div className="buttonBook"><Button
						title="Ajoutez cette personne comme ami afin d'échanger des livres avec elle!"
						bsStyle="primary" bsSize="small" onClick={this.savePendingFriend}>Ajouter comme
					ami</Button></div>}
				{userConnected && (!(this.props.previousPage == 'myBooks') && this.props.book.statut == 'FREE' && !this.props.book.empruntable) && this.props.book.pending &&
					<div>Vous avez ajouté cette personne comme ami</div>}
				<div className="imageBook"><img src={this.props.book.image} /></div>
				<div className="avisBook">
					<div className="moyenneNote">Moyenne des avis ({this.props.book.avis.length} avis)
					</div>
					<div className="ratingBook">
						<Rating empty={<SVGIcon href='#icon-star-empty' className='icon-rating' />}
							full={<SVGIcon href='#icon-star-full' className='icon-rating' />}
							readonly={true}
							initialRate={moyenne} />
					</div>
				</div>
				<div className="linkBook">
					<Link to={'book-detail/' + this.props.book.id + '/' + this.props.previousPage}>Voir les avis</Link>
				</div>
				<div>
					<label>Auteur: </label>
					<span>{this.props.book.auteur}</span>
				</div>
				<div>
					<label>Description: </label>{this.props.book.description}</div>
				<div>
				<ButtonToolbar className="buttonBook">
					{(this.props.previousPage == 'myBooks') &&
						<Button bsStyle="primary" bsSize="small"
							onClick={this.modifyBook}>Modifier</Button>}
					{(this.props.previousPage == 'myBooks') &&
						<Button bsStyle="primary" bsSize="small"
							onClick={this.handleClick}>Supprimer</Button>}
					{userConnected && (!(this.props.previousPage == 'myBooks') && this.props.book.statut == 'FREE' && this.props.book.empruntable) && !this.props.book.pending &&
						<Button bsStyle="primary" bsSize="small"
							onClick={this.handleLoan}>Emprunter</Button>}
					{!userConnected && <a href="/users/login">Connectez ou inscrivez-vous!</a>}
					{(!(this.props.previousPage == 'myBooks') && this.props.book.statut != 'FREE') && userConnected &&
						<span>Livre déjà emprunté</span>}
				</ButtonToolbar>
			</div>
		)
	}
}

export default withRouter(Book)
