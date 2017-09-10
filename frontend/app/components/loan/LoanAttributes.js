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
		this.state = {comments: this.props.loan.commentaires, oldAvis: {} }
		this.displayEvents = this.displayEvents.bind(this);
		this.displayStep = this.displayStep.bind(this);
		this.displayComment = this.displayComment.bind(this);
		this.displayAvis = this.displayAvis.bind(this);
		this.deleteComment = this.deleteComment.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAddAvisChange = this.handleAddAvisChange.bind(this);
		this.handleEditAvisChange = this.handleEditAvisChange.bind(this);
		this.saveEditAvis= this.saveEditAvis.bind(this)
		this.undoEditAvis= this.undoEditAvis.bind(this)
		this.deleteAvis= this.deleteAvis.bind(this)
		this._insertIn = this._insertIn.bind(this)
		this._compare= this._compare.bind(this)
		this._getLoanText = this._getLoanText.bind(this);
		this._insertSteps = this._insertSteps.bind(this);
		this._initTimeLine = this._initTimeLine.bind(this);

		// init timeline
		this._initTimeLine(this.props.avis, this.props.loan.commentaires )
	}

	componentWillReceiveProps(nextProps){
		console.log('cwrp')
		this._initTimeLine(nextProps.avis, nextProps.loan.commentaires )
	}

	_initTimeLine(avis, comments){
		if(avis){
			this._insertIn(comments, Object.assign(avis, {dateMessage: avis.dateavis}) )
		}
		let loanText = this._getLoanText(this.props.userId, this.props.loan.emprunteur, this.props.loan.preteur)

		this._insertSteps(comments, loanText)

		this.setState({
			comments,
			oldAvis: avis,
		});


	}


	editComment(idComment) {
		const newComments = this.state.comments.slice(0);
		const comment = newComments.find( (comment) => {
				return comment.id == idComment;
		})
		newComments.sort(this._compare)
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
		newComments.sort(this._compare)
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
		newComments.sort(this._compare)
		this.setState({
			comments: newComments
		});
	}

	editAvis(avis) {
		const comms = this.state.comments;
		//let avisInEvent = comms.find(ev => ev.id == avis.id)
		//avisInEvent.editMode = true;
		avis.editMode = true;
		comms.sort(this._compare)
			this.setState({
				// avis: Object.assign(avis, {editMode: true}),
				comments: comms
			});
	}

	handleEditAvisChange(avis){
		// let oldAvis;
		// if (!this.state.oldAvis.length){
		// 	oldAvis =this.state.avis;
		// }
		// else{
		// 	oldAvis = this.state.oldAvis;
		// }

		//change avis directly in events

		const comm = this.state.comments;
		const avisInEvent = comm.find(ev => (ev.id == avis.id))
		avisInEvent.libelle = avis.libelle;
		avisInEvent.note = avis.note;
		comm.sort(this._compare)
		this.setState({
			//avis,
			//oldAvis,
			comments: comm

		});
	}

	saveEditAvis(){
		// FIXME search first avis in events
		const avis = this.state.comments.find(ev => ev.dateavis != undefined)
		helpers.saveAvis(avis, this.props.loan.livre.id).then(() => {
			this.props.reloadEmprunt();
			this.setState({
				avis: Object.assign(avis,
					 {editMode: false})
			});
		});
	}

	undoEditAvis(avis){
		if(this.state.oldAvis.length){
			this.setState({
				comments: this.state.comments.sort(this._compare),
				avis: Object.assign(avis,
					 {editMode: false, note: this.state.oldAvis.note, libelle:this.state.oldAvis.libelle })
			});
		}
		else{
			this.setState({
				comments: this.state.comments.sort(this._compare),
				avis: Object.assign(avis, {editMode: false})
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
			} else if (event.dateMessage && !event.title) {
					return this.displayComment(event, userConnected )
			} else {
				//step
				return this.displayStep(event.title, event.icon, event.dateMessage )
			}
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
												<i onClick={this.editAvis.bind(this, avis)} className="material-icons md-18" style={{ color: '#6fba1c' }}>mode_edit</i>,
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

	_compare(a,b) {
	  if (a.dateMessage < b.dateMessage)
	    return -1;
	  if (a.dateMessage > b.dateMessage)
	    return 1;
	  return 0;
	}

	_insertIn(list, elementToInsert){
		// insert new element at the beginnig
		list.splice(0, 0, elementToInsert)
		//reorder the list
		list.sort(this._compare)

	}

	_insertSteps(comments, loanObj){
		// insert step requested at the right place
		this._insertIn(comments,
			 { dateMessage: this.props.loan.dateDemande,
				 title: loanObj.titleRequested,
				 icon: 'present_to_all'
			 })
		// insert step current at the right place
		this._insertIn(comments,
			 { dateMessage: this.props.loan.dateAccept,
				 title: loanObj.titleCurrent,
				 icon: 'thumb_up'
			 })
			// insert step sent at the right place
		this._insertIn(comments,
			 { dateMessage: this.props.loan.dateEnvoi,
				 title: loanObj.titleSent,
				 icon: 'call_made'
			 })
	}

	_getLoanText(userConnected, emprunteur, preteur){
		let returnObj ={}
		if (!this.props.isHistory && userConnected == emprunteur.id) {
			returnObj.titleRequested = "Vous avez demandé ce livre à " + preteur.fullName;
		}

		if (!this.props.isHistory && userConnected == preteur.id) {
			returnObj.titleRequested =  emprunteur.fullName + " souhaite vous emprunter le livre."  ;
		}

		if (!this.props.isHistory  && userConnected == emprunteur.id) {
			returnObj.titleCurrent = preteur.fullName + " a accepté votre demande d'emprunt et vous envoie le livre. ";
		}

		if (!this.props.isHistory &&  userConnected == preteur.id) {
			returnObj.titleCurrent = "Vous avez accepté la demande de " + emprunteur.fullName + ".";
		}

		if (!this.props.isHistory && userConnected == emprunteur.id) {
			returnObj.titleSent = "Vous avez renvoyé ce livre à " + preteur.fullName;
		}

		if (!this.props.isHistory && userConnected == preteur.id) {
			returnObj.titleSent = emprunteur.fullName + " vous a renvoyé le livre. Merci de clore l'emprunt si vous l'avez bien reçu.";
		}
		return returnObj;
	}

	render() {
		let envoyerMessage = "Noter le livre / Echanger avec le prêteur";
		if (this.props.isLending) {
			envoyerMessage = "Détails et envoyer message à l'emprunteur"
		}
		else {
			const status = this.props.loan.livre.statut;
			if (status == loanStatus.REQUESTED) {
				envoyerMessage = "Echanger avec le prêteur";
			}
		}

		let titleRequested, titleCurrent, titleSent
		const userConnected = this.props.userId;
		const emprunteur = this.props.loan.emprunteur;
		const preteur = this.props.loan.preteur;

		// retrieve all comments
		const comments = this.state.comments;

		let displayAddRating = false;
		if (userConnected == emprunteur.id && !this.props.avis &&
			(this.props.loan.livre.statut == loanStatus.CURRENT || this.props.loan.livre.statut == loanStatus.SENT)) {
			displayAddRating = true;
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
					 {displayAddRating &&
					<AddAvis
						 showInput={false}
						 bookId={this.props.loan.livre.id}
						 reloadEmprunt={this.props.reloadEmprunt}
					 />}
				</div>

				<div className="timeline">
					<Timeline>
					 { this.displayEvents(comments, userConnected) }
					 </Timeline>
				 </div>
			</div>
		)
	}
}

export default LoanAttributes
