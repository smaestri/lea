import React from 'react'
import { Link } from 'react-router'
import { Timeline, TimelineEvent } from 'react-event-timeline'
import AddComment from './AddComment'
import Comment from './Comment'
import formatDate, { loanStatus } from '../../helpers/utils'
import helpers from '../../helpers/api'
import AddAvis from '../book/AddAvis'
import EditAvis from '../book/EditAvis'
import style from './LoanAttributes.scss'

class LoanAttributes extends React.Component {

	constructor(props) {
		super(props);
		const events = this._initTimeLine(props.avis, props.loan)
		this.state = { events: events, oldAvis: Object.assign({}, props.avis) }
		this.displayEvents = this.displayEvents.bind(this);
		this.displayStep = this.displayStep.bind(this);
		this.displayComment = this.displayComment.bind(this);
		this.displayAvis = this.displayAvis.bind(this);
		this.deleteComment = this.deleteComment.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAddAvisChange = this.handleAddAvisChange.bind(this);
		this.handleEditAvisChange = this.handleEditAvisChange.bind(this);
		this.saveEditAvis = this.saveEditAvis.bind(this)
		this.undoEditAvis = this.undoEditAvis.bind(this)
		this.deleteAvis = this.deleteAvis.bind(this)
		this._insertIn = this._insertIn.bind(this)
		this._compare = this._compare.bind(this)
		this._getLoanText = this._getLoanText.bind(this);
		this._insertSteps = this._insertSteps.bind(this);
		this._initTimeLine = this._initTimeLine.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const events = this._initTimeLine(nextProps.avis, nextProps.loan)
		this.setState({
			events: events,
			oldAvis: Object.assign({}, nextProps.avis)
		})
	}

	_initTimeLine(avis, loan) {
		let events = [].concat(loan.commentaires)
		if (avis && events) {
			this._insertIn(events, Object.assign(avis, { dateMessage: avis.dateavis }))
		}
		let loanText = this._getLoanText(this.props.userId, loan.emprunteur, loan.preteur, loan.motifRefus)
		this._insertSteps(loan, events, loanText)
		return events;
	}

	editComment(idComment) {
		const newEvents = this.state.events.slice(0);
		const comment = newEvents.find((comment) => {
			return comment.id == idComment;
		})
		newEvents.sort(this._compare)
		comment.editMode = true;
		this.setState({
			events: newEvents
		});
	}

	undoEditComment(idComment) {
		const newEvents = this.state.events.slice(0);
		const comment = newEvents.find((comment) => {
			return comment.id == idComment;
		})
		comment.editMode = false;
		if (comment.oldMessage) {
			comment.message = comment.oldMessage;
		}
		newEvents.sort(this._compare)
		this.setState({
			events: newEvents
		});
	}

	saveEditComment(idComm) {
		const newEvents = this.state.events.slice(0);
		const comment = newEvents.find((comment) => {
			return comment.id == idComm;
		})
		comment.editMode = false;
		helpers.saveComment(comment.message, idComm).then(() => {
			this.props.reloadEmprunt();
		});
	}

	deleteComment(idComment) {
		helpers.deleteComment(idComment).then(() => {
			this.props.reloadEmprunt();
		});
	}

	handleChange(newMessage, id) {
		/** To understand : when changing message in state, props 'message' changes too!
		It should not as we just change the state => need to store old value
		*/
		const newEvents = this.state.events.slice(0);
		const comment = newEvents.find((comment) => (
			comment.id == id
		))
		if (!comment.oldMessage) {
			comment.oldMessage = comment.message
		}
		comment.message = newMessage;
		newEvents.sort(this._compare)
		this.setState({
			events: newEvents
		});
	}

	editAvis(avis) {
		const comms = this.state.events;
		avis.editMode = true;
		comms.sort(this._compare)
		this.setState({
			events: comms
		});
	}

	handleEditAvisChange(avis) {
		//change avis directly in events
		const comm = this.state.events;
		const avisInEvent = comm.find(ev => (ev.id == avis.id))
		avisInEvent.libelle = avis.libelle;
		avisInEvent.note = avis.note;
		comm.sort(this._compare)
		this.setState({
			events: comm

		});
	}

	saveEditAvis() {
		const avis = this.state.events.find(ev => ev.dateavis != undefined)
		helpers.saveAvis(avis, this.props.loan.livre.id).then(() => {
			this.props.reloadEmprunt();
		});
	}

	undoEditAvis(avis) {
		if (this.state.oldAvis) {
			this.setState({
				events: this.state.events.sort(this._compare),
				avis: Object.assign(avis,
					{ editMode: false, note: this.state.oldAvis.note, libelle: this.state.oldAvis.libelle })
			});
		}
		else {
			this.setState({
				events: this.state.events.sort(this._compare),
				avis: Object.assign(avis, { editMode: false })
			});
		}
	}

	deleteAvis(avis) {
		helpers.deleteAvis(avis.id).then(() => {
			this.props.reloadEmprunt();
		});
	}

	displayStep(title, icon, date) {
		return <TimelineEvent
			title={title}
			createdAt={formatDate(date)}
			icon={<i className="material-icons md-18">{icon}</i>}
			iconColor="navy" />
	}

	displayComment(comment, userConnected) {
		return (<TimelineEvent
			title={this.props.userId == comment.user.id ? "Vous avez saisi :" : comment.user.fullName + " a saisi le commentaire suivant:"}
			createdAt={formatDate(comment.dateMessage)}
			icon={<i className="material-icons md-18">email</i>}
			iconColor="navy"
			buttons={userConnected == comment.auteur && !this.props.isHistory && (comment.editMode ?
				[
					<i onClick={this.saveEditComment.bind(this, comment.id)} className="material-icons md-18" style={{ color: 'navy' }}>done</i>,
					<i onClick={this.undoEditComment.bind(this, comment.id)} className="material-icons md-18" style={{ color: 'navy' }}>close</i>
				] :
				[
					<i onClick={this.editComment.bind(this, comment.id)} className="material-icons md-18" style={{ color: 'navy' }}>mode_edit</i>,
					<i onClick={this.deleteComment.bind(this, comment.id)} className="material-icons md-18" style={{ color: 'navy' }}>delete</i>
				]
			)
			}
		>
			<Comment comment={comment} handleChange={this.handleChange} />
		</TimelineEvent>)
	}

	displayEvents(events, userConnected) {
		events.reverse();
		const eventsComp = events.map(event => {
			if (event.dateavis) {
					return this.displayAvis(event, userConnected, this.props.loan.emprunteur)
			} else if (event.dateMessage && !event.title) {
				return this.displayComment(event, userConnected)
			} else {
				return this.displayStep(event.title, event.icon, event.dateMessage)
			}
		})
		return eventsComp;
	};

	displayAvis(avis, userConnected, emprunteur) {
		return (
			<TimelineEvent
				title={emprunteur.fullName + " a saisi la note suivante "}
				createdAt={formatDate(avis.dateavis)}
				icon={<i className="material-icons md-18">favorite</i>}
				iconColor="navy"
				buttons={userConnected == avis.auteur && !this.props.isHistory && (avis.editMode ?
					[
						<i onClick={this.saveEditAvis.bind(this)} className="material-icons md-18" style={{ color: 'navy' }}>done</i>,
						<i onClick={this.undoEditAvis.bind(this, avis)} className="material-icons md-18" style={{ color: 'navy' }}>close</i>
					] :
					[
						<i onClick={this.editAvis.bind(this, avis)} className="material-icons md-18" style={{ color: 'navy' }}>mode_edit</i>,
						<i onClick={this.deleteAvis.bind(this, avis)} className="material-icons md-18" style={{ color: 'navy' }}>delete</i>
					]
				)
				}
			>
				<EditAvis
					avis={avis}
					handleEditAvisChange={this.handleEditAvisChange} />
			</TimelineEvent>)
	};

	handleAddAvisChange(avis) {
		this.setState({
			avis
		})
	}

	_compare(a, b) {
		if (a.dateMessage < b.dateMessage)
			return -1;
		if (a.dateMessage > b.dateMessage)
			return 1;
		return 0;
	}

	_insertIn(list, elementToInsert) {
		// insert new element at the beginnig
		list.splice(0, 0, elementToInsert)
		//reorder the list
		list.sort(this._compare)
	}

	_insertSteps(loan, events, loanText) {
		if (loan.dateDemande) {
			this._insertIn(events,
				{
					dateMessage: loan.dateDemande,
					title: loanText.titleRequested,
					icon: 'present_to_all'
				})
		}
		if (loan.dateAccept) {
			this._insertIn(events,
				{
					dateMessage: loan.dateAccept,
					title: loanText.titleCurrent,
					icon: 'thumb_up'
				})
		}
		if (loan.dateEnvoi) {
			this._insertIn(events,
				{
					dateMessage: loan.dateEnvoi,
					title: loanText.titleSent,
					icon: 'call_made'
				})
		}

		if (loan.dateRefus) {
			this._insertIn(events,
				{
					dateMessage: loan.dateRefus,
					title: loanText.titleRefus,
					icon: 'clear'
				})
		}

		if (loan.dateCloture) {
			this._insertIn(events,
				{
					dateMessage: loan.dateCloture,
					title: loanText.titleCloture,
					icon: 'done'
				})
		}
	}

	_getLoanText(userConnected, emprunteur, preteur, motif) {
		let returnObj = {}
		returnObj.titleCloture = preteur.fullName + " a cloturé l'emprunt";
		returnObj.titleRefus = preteur.fullName + " a refusé cette demande avec le motif: " + motif;
		if (userConnected == emprunteur.id) {
			returnObj.titleRequested = "Vous avez demandé ce livre à " + preteur.fullName;
			returnObj.titleCurrent = preteur.fullName + " a accepté votre demande d'emprunt et vous envoie le livre. ";
			returnObj.titleSent = "Vous avez renvoyé ce livre à " + preteur.fullName;
		}

		if (userConnected == preteur.id) {
			returnObj.titleRequested = emprunteur.fullName + " souhaite vous emprunter le livre.";
			returnObj.titleCurrent = "Vous avez accepté la demande de " + emprunteur.fullName + ".";
			returnObj.titleSent = emprunteur.fullName + " vous a renvoyé le livre. Merci de clore l'emprunt si vous l'avez bien reçu.";
			returnObj.titleRefus = "Vous a refusé cette demande avec le motif " + motif;
		}

		return returnObj;
	}

	render() {
		if (!this.props.loan) {
			return
		}
		const events = this.state.events;

		if (!events)
			return
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

		let displayAddRating = false;
		if (userConnected == emprunteur.id && !this.props.avis && !this.props.isHistory &&
			(this.props.loan.livre.statut == loanStatus.CURRENT || this.props.loan.livre.statut == loanStatus.SENT)) {
			displayAddRating = true;
		}

		return (
			<div className="container-timeline">
				<div className="header-timeline">
					{!this.props.isHistory && <AddComment
						idLoan={this.props.loan.id}
						reloadEmprunt={this.props.reloadEmprunt}
						destinataire={userConnected == preteur.id ? emprunteur.fullName : preteur.fullName}>
					</AddComment>}
					{displayAddRating &&
						<AddAvis
							showInput={false}
							bookId={this.props.loan.livre.id}
							reloadEmprunt={this.props.reloadEmprunt}
						/>}
				</div>
				<div className="timeline">
					<Timeline>
						{this.displayEvents(events, userConnected)}
					</Timeline>
				</div>
			</div>
		)
	}
}

export default LoanAttributes
