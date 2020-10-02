import React from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import Rating from 'react-rating'
import helpersLoan from '../../helpers/loan-actions/api'
import helpersFriend from '../../helpers/friend/api'
import { SVGIcon } from '../common/SVGIcon'
import './Book.scss'

class Book extends React.Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleLoan = this.handleLoan.bind(this);
		this.savePendingFriend = this.savePendingFriend.bind(this);
		
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
		if(!this.props.userId){
			window.location.replace("/#/login");
			return;
    };
    this.props.displaySpinner();
		helpersLoan.loanBook(this.props.book.id, this.props.book.intermediaireid).then(() => {
      this.setState({ redirectToMyloans: true });
      this.props.hideSpinner();
		})
	}

	savePendingFriend() {
    this.props.displaySpinner();
		helpersFriend.savePendingFriend(this.props.book.mailPreteur).then(() => {
      this.setState({ redirectToMyFriends: true });
      this.props.hideSpinner();
		})
	}

	render() {

		const isConnected = !!this.props.userId;
		let livreModel={}

		if(this.state.redirectToMyloans) {
			return <Redirect to='/my-loans'/>;
		}

		if (this.state.redirectToMyFriends) {
			return <Redirect to='/my-friends'/>;
		}

		if(!this.props.book || !livreModel) {
			return;
		} else {
			livreModel = this.props.book.livreModel;
		}

		//compute book note
		let sum = 0;
		let avis = [];
		if(livreModel.avis && livreModel.avis.length > 0) {
			avis = livreModel.avis;
		}
		avis.forEach((avis) => {
			sum = sum + avis.note;
		});
    let moyenne = sum / avis.length;
    
  let image = "/webjars/assets/img/book.png";

    if(livreModel.image) {
      image = livreModel.image;
    }

		return (
			<div className="book-container">
				<div className="title-book form-horizontal">
					{livreModel.titreBook}
				</div>
				
				<div className="image-container">
					<div className="image-content">
						<img className="img" src={image} />
					</div>
				</div>
				<div className="avisBook">
					<div className="moyenneNote">Moyenne des avis ({avis.length} avis)
					</div>
					<div className="ratingBook">
						{<Rating
							readonly={true}
							initialRating={moyenne} />}
					</div>
          <div className="linkBook">
					  <Link to={'/book-detail/' + livreModel.id}>Voir les avis</Link>
				  </div>
				</div>
			
        {isConnected && !(this.props.currentPage == 'myBooks') &&
					<div><label className="book-preteur">Prêteur : </label>
						<Link to={'/user-detail/' + this.props.book.userId }><span>{this.props.book.preteur}</span></Link>
					</div>
				}
				{!isConnected && !(this.props.currentPage == 'myBooks') &&
					<div><label
						className="book-preteur">Prêteur : </label><span>{this.props.book.preteur}</span>
					</div>}
				<div className="content-auteur">
					<label>Auteur : </label>
					<span>{livreModel.auteur}</span>
				</div>
        {(!(this.props.currentPage == 'myBooks') && this.props.book.statut != 'FREE') &&
						<span>Livre déjà emprunté</span>}
				{livreModel.description && <div><label>Description : </label>{livreModel.description}</div> }
				<ButtonToolbar className='container-buttons'>
					{(isConnected  && (this.props.currentPage == 'myBooks')) &&
						<Button bsStyle="primary" bsSize="small" onClick={this.handleClick}>Supprimer</Button>}
					{/* {(isConnected  && (this.props.currentPage == 'myBooks')) &&
						<Link to={'/edit-book/' + livreModel.id }><Button bsStyle="primary" bsSize="small">Modifier</Button></Link>} */}
					{(!(this.props.currentPage == 'myBooks')&& this.props.book.statut == 'FREE') &&
						<Button bsStyle="primary" bsSize="small" disabled={this.state.disableEmprunterButton}
							onClick={this.handleLoan}>Emprunter</Button>}
							
				
				
				</ButtonToolbar>
        {livreModel.isbn10 && <div>
            <a href={`http://www.amazon.fr/dp/${livreModel.isbn10}?tag=effectivecodi-21`} target="_blank">Acheter sur Amazon</a>
          </div>}
			</div>
		)
	}
}

export default withRouter(Book)
