import React from 'react'
import { Link } from 'react-router'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import AddComment from './AddComment'
import Comment from './Comment'
import formatDate, {loanStatus} from '../../helpers/utils'
import helpers from '../../helpers/api'
import AddAvis from '../book/AddAvis'
import EditAvis from '../book/EditAvis'

class LoanAttributes extends React.Component {

	constructor(props) {
		super(props);
		this.state = {comments: this.props.loan.commentaires, avis: this.props.avis, oldAvis: {} }
		this.displayEvents = this.displayEvents.bind(this);
		this.displayStep = this.displayStep.bind(this);
		this.displayComment = this.displayComment.bind(this);
		this.displayAvis = this.displayAvis.bind(this);
		this.deleteComment = this.deleteComment.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAddAvisChange = this.handleAddAvisChange.bind(this);
		this.handleEditAvisChange = this.handleEditAvisChange.bind(this);
		this._isDateBetween = this._isDateBetween.bind(this)
		this._isDateAfter = this._isDateAfter.bind(this)
		this.saveEditAvis= this.saveEditAvis.bind(this)
		this.undoEditAvis= this.undoEditAvis.bind(this)
		this.deleteAvis= this.deleteAvis.bind(this)
		this._insertAvis = this._insertAvis.bind(this)
	}

	componentWillReceiveProps(nextProps){
		// TODO maybe find a better way to refresh when adding new comment/avis
		this.setState({
			comments: nextProps.loan.commentaires,
			avis: nextProps.avis,
			oldAvis: nextProps.avis,
		});
	}

	editComment(idComment) {
		const newComments = this.state.comments.slice(0);
		const comment = newComments.find( (comment) => {
				return comment.id == idComment;
		})
			comment.editMode = true;
			this.setState({
				comments: newComments
			});
	}

	undoEditComment(idComment) {
		const newComments = this.state.comments.slice(0);
		const comment = newComments.find( (comment) => {
				return comment.id == idComment;
		})
		// set comment in read mode
		comment.editMode=false;
		 // set old message if one
		 if(comment.oldMessage){
			 comment.message = comment.oldMessage;
		 }
		this.setState({
			comments: newComments
		});
	}

	saveEditComment(idComm){
		const newComments = this.state.comments.slice(0);
		const comment = newComments.find( (comment) => {
				return comment.id == idComm;
		})
		comment.editMode=false;
		helpers.saveComment(comment.message, idComm).then(() => {
			this.props.reloadEmprunt();
			this.setState({
				comments: newComments
			});
		});
	}

	deleteComment(idComment){
		helpers.deleteComment(idComment).then(() => {
			this.props.reloadEmprunt();
		});
	}

	handleChange(newMessage, id){
		/** To understand : when changing message in state, props 'message' changes too!
		It should not as we just change the state => need to store old value
		*/
		const newComments = this.state.comments.slice(0);
		const comment = newComments.find( (comment) => {
				return comment.id == id;
		})
		if(!comment.oldMessage){
			comment.oldMessage = comment.message
		}
		comment.message = newMessage;

		this.setState({
			comments: newComments
		});
	}

	editAvis(idComment) {
			this.setState({
				avis: Object.assign(this.state.avis, {editMode: true})
			});
	}

	handleEditAvisChange(avis){
		let oldAvis;
		if (!this.state.oldAvis.length){
			oldAvis =this.state.avis;
		}
		else{
			oldAvis = this.state.oldAvis;
		}

		this.setState({
			avis,
			oldAvis
		});
	}

	saveEditAvis(){
		helpers.saveAvis(this.state.avis, this.props.loan.livre.id).then(() => {
			this.props.reloadEmprunt();
			this.setState({
				avis: Object.assign(this.state.avis,
					 {editMode: false})
			});
		});
	}

	undoEditAvis(avis){
		if(this.state.oldAvis){
			this.setState({
				avis: Object.assign(this.state.avis,
					 {editMode: false, note: this.state.oldAvis.note, libelle:this.state.oldAvis.libelle })
			});
		}
		else{
			this.setState({
				avis: Object.assign(this.state.avis,
					 {editMode: false})
			});
		}
	}

	deleteAvis(avis){
		helpers.deleteAvis(avis.id).then(() => {
			this.props.reloadEmprunt();
		});
	}

	displayStep(title, icon, date){
		return <TimelineEvent
				title={title}
				createdAt={formatDate(date)}
				icon={<i className="material-icons md-18">{icon}</i>}
				iconColor="#6fba1c" />
	}

	displayComment(comment, userConnected){
		return (<TimelineEvent
							title={"Message de " + comment.user.fullName}
							createdAt={formatDate(comment.dateMessage)}
							icon={<i className="material-icons md-18">email</i>}
							iconColor="#6fba1c"
							buttons={userConnected == comment.auteur && (comment.editMode ?
								[
										<i onClick={this.saveEditComment.bind(this, comment.id)} className="material-icons md-18" style={{ color: '#6fba1c' }}>done</i>,
										<i onClick={this.undoEditComment.bind(this, comment.id)} className="material-icons md-18" style={{ color: '#6fba1c' }}>close</i>
								] :
								[
											<i onClick={this.editComment.bind(this, comment.id)} className="material-icons md-18" style={{ color: '#6fba1c' }}>mode_edit</i>,
											<i onClick={this.deleteComment.bind(this, comment.id)} className="material-icons md-18" style={{ color: '#6fba1c' }}>delete</i>
									]
								)
								}
					 >
						<Comment comment={comment} handleChange={this.handleChange} />
					 </TimelineEvent>)
	}

	displayEvents(events, userConnected){
		events.reverse();
		const eventsComp =  events.map( event => {
			if (event.dateavis){
				return this.displayAvis(event, userConnected)
			}
			return this.displayComment(event, userConnected )
			})
			return eventsComp;
	};

	displayAvis(avis, userConnected){
			return (
			<TimelineEvent
								title={"Vous avez saisi la note suivante "}
								createdAt={formatDate(avis.dateavis)}
								icon={<i className="material-icons md-18">favorite</i>}
								iconColor="#6fba1c"
								buttons={userConnected == avis.auteur && (avis.editMode ?
									[
											<i onClick={this.saveEditAvis.bind(this)} className="material-icons md-18" style={{ color: '#6fba1c' }}>done</i>,
											<i onClick={this.undoEditAvis.bind(this, avis)} className="material-icons md-18" style={{ color: '#6fba1c' }}>close</i>
									] :
									[
												<i onClick={this.editAvis.bind(this)} className="material-icons md-18" style={{ color: '#6fba1c' }}>mode_edit</i>,
												<i onClick={this.deleteAvis.bind(this, avis)} className="material-icons md-18" style={{ color: '#6fba1c' }}>delete</i>
										]
									)
									}
						 >
						 <EditAvis
						 		avis={avis}
								handleEditAvisChange={this.handleEditAvisChange}
						/>
			 </TimelineEvent>)
	};

	handleAddAvisChange(avis){
		this.setState({
			avis
		})
	}

	_isDateBetween(dateToCheck, firstDAte, lasteDate){
		if (dateToCheck > firstDAte && dateToCheck < lasteDate){
			return true;
		}
		return false;
	}

	_isDateAfter(dateToCheck, dateToCompare){
		if (dateToCheck > dateToCompare){
			return true;
		}
		return false;
	}

	_insertAvis(list, avis){
		if(!list || !list.length || !avis){
			return;
		}
		let index =0;
		for(index; index<list.length; index++){
		  const currentValue = list[index].dateMessage;
		  if(avis.dateavis >= currentValue){
		    continue;
		  } else {
		    break;
		  }
		}
		list.splice(index, 0, avis)
	}

	render() {
		let envoyerMessage = "Noter le livre / Echanger avec le prêteur";
		if (this.props.isLending) {
			envoyerMessage = "Détails et envoyer message à l'emprunteur"
		}
		else {
			if (status == loanStatus.REQUESTED) {
				envoyerMessage = "Echanger avec le prêteur";
			}
		}

		let titleRequested, titleCurrent, titleSent
		const userConnected = this.props.userId;
		const emprunteur = this.props.loan.emprunteur;
		const preteur = this.props.loan.preteur;

		if (!this.props.isHistory && userConnected == emprunteur.id) {
			titleRequested = "Vous avez demandé ce livre à " + preteur.fullName;
		}

		if (!this.props.isHistory && userConnected == preteur.id) {
			titleRequested =  emprunteur.fullName + " souhaite vous emprunter le livre."  ;
		}

		if (!this.props.isHistory  && userConnected == emprunteur.id) {
			titleCurrent = preteur.fullName + " a accepté votre demande d'emprunt et vous envoie le livre. ";
		}

		if (!this.props.isHistory &&  userConnected == preteur.id) {
			titleCurrent = "Vous avez accepté la demande de " + emprunteur.fullName + ".";
		}

		if (!this.props.isHistory && userConnected == emprunteur.id) {
			titleSent = "Vous avez renvoyé ce livre à " + preteur.fullName;
		}

		if (!this.props.isHistory && userConnected == preteur.id) {
			titleSent = emprunteur.fullName + " vous a renvoyé le livre. Merci de clore l'emprunt si vous l'avez bien reçu.";
		}

		//need to retrieve comments and show them at the right place in the timeline
		const dateDemande = this.props.loan.dateDemande;
		const dateAccept = this.props.loan.dateAccept;
		const dateEnvoi = this.props.loan.dateEnvoi;
		const status = this.props.loan.livre.statut;

		const avis = this.state.avis;

		let avisAfterRequested, avisAfterCurrent, avisAfterSent;
		if (avis && this._isDateBetween(avis.dateavis, dateDemande, dateAccept )){
			avisAfterRequested = avis;
		}
		if (avis && this._isDateBetween(avis.dateavis, dateAccept, dateEnvoi )){
			avisAfterCurrent = avis;
		}
		if (avis &&  this._isDateAfter(avis.dateavis, dateEnvoi)) {
			avisAfterSent = avis;
		}

		// retrieve all comments
		const comments = this.state.comments;

		const commentsAfterRequested = comments.filter(comment => {
			return this._isDateBetween(comment.dateMessage, dateDemande, dateAccept )
		})
		this._insertAvis(commentsAfterRequested, avisAfterRequested)

		const commentsAfterCurrent = comments.filter(comment => {
			return this._isDateBetween(comment.dateMessage, dateAccept, dateEnvoi )
		})
		this._insertAvis(commentsAfterCurrent, avisAfterCurrent)

		const commentsAfterSent = comments.filter(comment => {
			return this._isDateAfter(comment.dateMessage, dateEnvoi)
		})
		this._insertAvis(commentsAfterSent, avisAfterSent)

		let displayRating = false;
		if (userConnected == emprunteur.id && !this.props.avis &&
			(this.props.loan.livre.statut == loanStatus.CURRENT || this.props.loan.livre.statut == loanStatus.SENT)) {
			displayRating = true;
		}

		return (
			<div>
				<div className="header-timeline">

					<AddComment
						 idLoan={this.props.loan.id}
						 saveComment={this.saveComment}
						 reloadEmprunt={this.props.reloadEmprunt}
						 destinataire={userConnected == preteur.id?emprunteur.fullName:preteur.fullName}>
					 </AddComment>
					 {displayRating &&
					<AddAvis
						 bookId={this.props.loan.livre.id}
						 updateAvis={this.handleAvisChange}
						 allowModification={false}
						 reloadEmprunt={this.props.reloadEmprunt}
					 />}
				</div>

				<div className="timeline">
					<Timeline>
					{ status == loanStatus.SENT &&
					 this.displayStep(titleSent, 'call_made', this.props.loan.dateEnvoi)}
					 {commentsAfterSent && this.displayEvents(commentsAfterSent, userConnected)}

					 { (status == loanStatus.CURRENT ||
						 status == loanStatus.SENT ) &&
							this.displayStep(titleCurrent, 'thumb_up', this.props.loan.dateAccept)}
							{commentsAfterCurrent && this.displayEvents(commentsAfterCurrent, userConnected, userConnected	)}

						{ (status ==  loanStatus.REQUESTED ||
						  status == loanStatus.CURRENT ||
							status == loanStatus.SENT) &&
							 this.displayStep(titleRequested, 'present_to_all', this.props.loan.dateDemande) }
							 {commentsAfterRequested && this.displayEvents(commentsAfterRequested, userConnected)}

					 </Timeline>
				 </div>
			</div>
		)
	}
}

export default LoanAttributes
