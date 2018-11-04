import React from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import Rating from 'react-rating'
import helpersLoan from '../../helpers/loan-actions/api'
import helpersFriend from '../../helpers/friend/api'
import { SVGIcon } from '../common/SVGIcon'
import style from './Book.scss'

class Book extends React.Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleLoan = this.handleLoan.bind(this);
		this.savePendingFriend = this.savePendingFriend.bind(this);
		this.userConnected = props.userId !== 0;
		this.state = {
			disableEmprunterButton: false,
			redirectToMyLoans: false,
			redirectToMyFriends: false
		};
	}

	handleClick(e) {
		this.props.handleDelete(e, this.props.book.id);
	}


	handleLoan(event) {
		this.setState({ disableEmprunterButton: true });
		event.preventDefault();
		if(!this.userConnected){
			window.location.replace("/login");
			return;
		}
		helpersLoan.loanBook(this.props.book.id, this.props.book.intermediaireid).then(() => {
			this.setState({ redirectToMyloans: true });
		})
	}

	savePendingFriend() {
		helpersFriend.savePendingFriend(this.props.book.mailPreteur).then(() => {
			this.setState({ redirectToMyFriends: true });
		})
	}

	render() {

		if(this.state.redirectToMyloans) {
			return <Redirect to='/my-loans'/>;
		}

		if (this.state.redirectToMyFriends) {
			return <Redirect to='/my-friends'/>;
		}

		//compute book note
		let sum = 0;
		this.props.book.avis.forEach((avis) => {
			sum = sum + avis.note;
		});
		let moyenne = sum / this.props.book.avis.length;
		const url = '/edit-book/' + this.props.book.id
		return (
			<div className="book-container">
				<div className="title-book form-horizontal" ><p title={this.props.book.titreBook}>{this.props.book.titreBook}</p></div>
				{this.userConnected && !(this.props.currentPage == 'myBooks') &&
					<div><label className="book-preteur">Prêteur : </label>
						<Link to={'/user-detail/' + this.props.book.userId }><span>{this.props.book.preteur}</span></Link>
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
						<Rating emptySymbol={<SVGIcon href='#icon-star-empty' className='icon-rating' />}
							fullSymbol={<SVGIcon href='#icon-star-full' className='icon-rating' />}
							readonly={true}
							initialRating={moyenne} />
					</div>
				</div>
				<div className="linkBook">
					<Link to={'/book-detail/' + this.props.book.id}>Voir les avis</Link>
				</div>
				<div className="content-auteur">
					<label>Auteur : </label>
					<span>{this.props.book.auteur}</span>
				</div>
				{this.props.book.description && <div><label>Description : </label>{this.props.book.description}</div> }
				<ButtonToolbar className='container-buttons'>
					{(this.userConnected && this.props.currentPage == 'myBooks') &&
						<LinkContainer to={url}><Button bsStyle="primary" bsSize="small">Modifier</Button></LinkContainer>}

					{(this.userConnected  && this.props.currentPage == 'myBooks') &&
						<Button bsStyle="primary" bsSize="small" onClick={this.handleClick}>Supprimer</Button>}

					{(this.userConnected  && !this.props.currentPage == 'myBooks' && this.props.book.statut == 'FREE') &&
						<Button bsStyle="primary" bsSize="small" disabled={this.state.disableEmprunterButton}
							onClick={this.handleLoan}>Emprunter</Button>}
							
					{(this.userConnected && !(this.props.currentPage == 'myBooks') && this.props.book.statut != 'FREE') &&
						<span>Livre déjà emprunté</span>}
				</ButtonToolbar>
			</div>
		)
	}
}

export default withRouter(Book)
