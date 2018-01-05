import React from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
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
		this.userConnected = props.userId !== 0;
		this.state = {
			disableEmprunterButton: false,
		};
	}

	handleClick(e) {
		this.props.handleDelete(e, this.props.book.id);
	}

	modifyBook() {
		this.props.router.push('/edit-book/' + this.props.book.id)
	}

	handleLoan(event) {
		this.setState({ disableEmprunterButton: true });
		event.preventDefault();
		if(!this.userConnected){
			window.location.replace("/login");
			return;
		}
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

		//compute book note
		let sum = 0;
		this.props.book.avis.forEach((avis) => {
			sum = sum + avis.note;
		});
		let moyenne = sum / this.props.book.avis.length;
		return (
			<div className="book-container">
				<div className="title-book form-horizontal" ><p title={this.props.book.titreBook}>{this.props.book.titreBook}</p></div>
				{this.userConnected && !(this.props.currentPage == 'myBooks') &&
					<div><label className="book-preteur">Prêteur : </label>
						<Link to={'user-detail/' + this.props.book.userId + '/' + this.props.currentPage}><span>{this.props.book.preteur}</span></Link>
					</div>}
				{!this.userConnected && !(this.props.currentPage == 'myBooks') &&
					<div><label
						className="book-preteur">Prêteur : </label><span>{this.props.book.preteur}</span>
					</div>}
				<div className="image-container">
					<div className="image-content">
						<img className="img" src={this.props.book.image} />
					</div>
				</div>
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
					<Link to={'book-detail/' + this.props.book.id + '/' + this.props.currentPage}>Voir les avis</Link>
				</div>
				<div className="content-auteur">
					<label>Auteur : </label>
					<span>{this.props.book.auteur}</span>
				</div>
				{this.props.book.description && <div><label>Description : </label>{this.props.book.description}</div> }
				<ButtonToolbar className='container-buttons'>
					{(this.props.currentPage == 'myBooks') &&
						<Button bsStyle="primary" bsSize="small"
							onClick={this.modifyBook}>Modifier</Button>}

					{(this.props.currentPage == 'myBooks') &&
						<Button bsStyle="primary" bsSize="small"
							onClick={this.handleClick}>Supprimer</Button>}

					{(!(this.props.currentPage == 'myBooks') && this.props.book.statut == 'FREE') &&
						<Button bsStyle="primary" bsSize="small" disabled={this.state.disableEmprunterButton}
							onClick={this.handleLoan}>Emprunter</Button>}
							
					{(!(this.props.currentPage == 'myBooks') && this.props.book.statut != 'FREE') &&
						<span>Livre déjà emprunté ou demandé</span>}
				</ButtonToolbar>
			</div>
		)
	}
}

export default withRouter(Book)
