import React from 'react'
import { withRouter } from 'react-router'
import { Button } from 'react-bootstrap'
import helpers from '../../helpers/api'
import {loanStatus} from '../../helpers/utils'
import Comment from './Comment'
import AddComment from './AddComment'
import ButtonsEmprunt from './ButtonsEmprunt'
import AddAvis from '../book/AddAvis'
import LoanAttributes from './LoanAttributes'


class LoanDetail extends React.Component {

	constructor(props) {
		super(props);
		this.saveComment = this.saveComment.bind(this);
		this.saveEditComment = this.saveEditComment.bind(this);
		this.deleteComment = this.deleteComment.bind(this);
		this.refreshEmprunt = this.refreshEmprunt.bind(this);
		this.returnToLoans = this.returnToLoans.bind(this);
		this.handleAvisChange = this.handleAvisChange.bind(this);
		this.state = { loan: {} };
	}

	componentDidMount() {
			helpers.getLoan(this.props.params.loanId).then ( loan => {
					this.setState({ loan: loan })
			});
	}

	saveComment(commObj) {
		helpers.saveComment(commObj, null, this.props.params.loanId).then(() => {
			this.componentDidMount();
		});
	}

	deleteComment(commId) {
		helpers.deleteComment(commId).then(() => {
			this.componentDidMount();

		});
	}

	saveEditComment(commObj, idComm) {
		helpers.saveComment(commObj, idComm, this.props.params.loanId).then(() => {
			this.componentDidMount(true);
		});
	}

	refreshEmprunt() {
		this.componentDidMount(true);
	}

	returnToLoans() {
		if (this.props.params.isLending == 'true') {
			this.props.router.push('/my-lendings');
		}
		else {
			this.props.router.push('/my-loans')
		}
	}

	handleAvisChange (avis){
		this.setState({
			avis
		})
	}

	render() {
		// if no loan return
		const loan = this.state.loan;
		if (!loan || !loan.livre) {
			return null;
		}

		//get comments
		const userConnected = this.props.userId;
		const comments = loan.commentaires.map(comment => {
			let displayButtons = false;
			// display edit and delete buttons for comments
			if (comment.auteur == userConnected) {
				displayButtons = true;
			}

			let message = '';
			if (comment.message) {
				message = comment.message;
			}
			return <Comment key={comment.id}
			                id={comment.id}
			                message={message}
			                dateMessage={comment.dateMessage}
			                auteur={comment.user.fullName}
			                displayButtons={displayButtons}
			                deleteComment={this.deleteComment}
			                saveEditComment={this.saveEditComment}/>
		});

		let title = null;
		let typeEmprunt = "le prêteur";
		if (this.props.params.isLending == 'true') {
			typeEmprunt = "l'emprunteur";
			title = <span>Prêt du livre <i>{loan.livre.titreBook}</i> </span>
		}
		else {
			title = <span>Emprunt du livre <i>{loan.livre.titreBook}</i></span>
		}

		//Get rating for this book and this user
		let avis = null;
		loan.livre.avis.forEach((avisBook) => {
			if (avisBook.auteur == loan.emprunteur.id) {
				avis = avisBook;
				//TODO perf
			}
		});

		let displayRating = false;
		if (userConnected == loan.emprunteur.id &&
			(loan.livre.statut == loanStatus.CURRENT || loan.livre.statut == loanStatus.SENT)) {
			displayRating = true;
		}
		return (
			<div className="container">
				<h1>{title}</h1>
				<div className="emprunt-information">
					<LoanAttributes
					 	loan={loan}
						isHistory={false}
            isLending={this.props.params.isLending === "true"}
						userId={this.props.userId}
					/>
					<ButtonsEmprunt
					 	loan={loan}
						onRefreshCount={this.props.onRefreshCount}
					  reloadEmprunt={this.refreshEmprunt}
 						userId={this.props.userId}
						/>
				</div>
				<div className="content-emprunt">
					<div className="emprunt-ratings">
						{displayRating &&
							 <AddAvis
							    bookId={loan.livre.id}
									avis={avis}
									updateAvis={this.handleAvisChange}
									allowModification={true}
								/>}
					</div>
					<div className="emprunt-comments">
						<h3>Commentaires entre vous et {typeEmprunt}</h3>
						<ul>{comments}</ul>
						<AddComment loanId={loan.id} saveComment={this.saveComment}></AddComment>
					</div>
				</div>
				<Button bsStyle="primary" onClick={this.returnToLoans}>Retour</Button>
			</div>
		)
	}
}

export default withRouter(LoanDetail)
