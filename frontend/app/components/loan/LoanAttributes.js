import React from 'react'
import { Timeline, TimelineEvent } from 'react-event-timeline'
import { withRouter } from 'react-router'
import AddComment from './AddComment'
import Comment from './Comment'
import formatDate, { loanStatus } from '../../helpers/utils'

import AddAvis from '../book/AddAvis'
import EditAvis from '../book/EditAvis'

class LoanAttributes extends React.Component {

	constructor(props) {
		super(props);
		this.displayEvents = this.displayEvents.bind(this);
		this.displayStep = this.displayStep.bind(this);
		this.displayComment = this.displayComment.bind(this);
		this.displayAvis = this.displayAvis.bind(this);
		this._insertIn = this._insertIn.bind(this)
		this._compare = this._compare.bind(this)
		this._getLoanText = this._getLoanText.bind(this);
		this._insertSteps = this._insertSteps.bind(this);
    this._initTimeLine = this._initTimeLine.bind(this);
    this._loadAllEvents = this._loadAllEvents .bind(this);
    this._commentHasChanged = this._commentHasChanged.bind(this)
    this._avisHaveChanged = this._avisHaveChanged.bind(this)
    this.state = {
      events: []

    }
	}

  _loadAllEvents() {
      let avis = this.props.loan.livreModel.avis.find( avisBook => {
        let dateFin = this.props.loan.dateCloture;
        if(this.props.loan.dateRefus){
          dateFin = this.props.loan.dateRefus;
        }
        return (this.props.loan.emprunteurId == avisBook.auteur && avisBook.dateavis >= this.props.loan.dateDemande &&
          (!dateFin || avisBook.dateavis <= dateFin))
    });
    const events = this._initTimeLine(avis, this.props.loan)
		this.setState({
			events: events,
		})
  }

	componentDidMount() {
    this._loadAllEvents();
  }
  
  componentDidUpdate(prevProps) {
    const oldComments = prevProps.loan.commentaires;
    const newComments = this.props.loan.commentaires;

    const oldAvis = prevProps.avis
    const newAvis = this.props.avis

     if(this._commentHasChanged(oldComments,newComments )) {
      this._loadAllEvents();
     }

     if(this._avisHaveChanged(oldAvis, newAvis)) {
      this._loadAllEvents();
     }
  }

  _commentHasChanged(oldComments, newComments) {
    // new /del comment
    if(oldComments.length != newComments.length) {
      return true;
    }

    // edit comment
    for(let i = 0;i<oldComments.length;i++) {
      if(oldComments[i].message != newComments[i].message) {
        return true;
      }
    }
  }

  _avisHaveChanged(oldAvis, newAvis) {
     // new avis 
     if(!oldAvis && newAvis) {
     return true;
    }
    // avis changed
    if (newAvis && oldAvis &&((newAvis.libelle != oldAvis.libelle) || (newAvis.note != oldAvis.note))) {
      return true;
    }

    //avis deleted
    if(!newAvis && oldAvis ) {
      return true;
    }
  }

	_initTimeLine(avis, loan) {
		let events = [].concat(loan.commentaires)
		if (avis) {
			this._insertIn(events, Object.assign(avis, { dateMessage: avis.dateavis }))
    }
		let loanText = this._getLoanText(this.props.userId, loan.emprunteur, loan.preteur, loan.motifRefus)
    this._insertSteps(loan, events, loanText)
		return events;
	}

	displayStep(title, icon, date) {
		return <TimelineEvent
			key={title + date}
			title={title}
			createdAt={formatDate(date)}
      icon={<i className="material-icons md-18">{icon}</i>}
			iconColor="navy" />
	}

	displayComment(event, userConnected, isActive) {
		 return <Comment reloadEmprunt={this.props.reloadEmprunt} comment={event} userConnected={userConnected} isActive={isActive} />;
	}

	displayEvents(events, userConnected, isActive) {
		events.reverse();
		const eventsComp = events.map(event => {
			if (event.dateavis) {
        return this.displayAvis(event, userConnected, this.props.loan.emprunteur, isActive)
			} else if (event.dateMessage && !event.title) {
        return this.displayComment(event, userConnected, isActive)
			} else {
				return this.displayStep(event.title, event.icon, event.dateMessage)
			}
		})
		return eventsComp;
	};

	displayAvis(avis, userConnected, emprunteur, isActive) {
		let auteurAvis = emprunteur.fullName + " a ";
		if(userConnected == emprunteur.id) {
			auteurAvis = 'Vous avez ';
		}
		return (
	  <EditAvis avis={avis} auteurAvis={auteurAvis} userConnected={userConnected} isActive={isActive} reloadEmprunt={this.props.reloadEmprunt} livreModelId={this.props.loan.livreModel.id}/>)
	};

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
		if (userConnected == emprunteur.id) {
			returnObj.titleRequested = "Vous avez demandé ce livre à " + preteur.fullName;
			returnObj.titleCurrent = preteur.fullName + " a accepté votre demande d'emprunt et vous envoie le livre. ";
			returnObj.titleSent = "Vous avez renvoyé ce livre à " + preteur.fullName;
			returnObj.titleRefus = preteur.fullName  + " a refusé cette demande avec le motif: " + motif;
			returnObj.titleCloture = preteur.fullName + " cloturé l'emprunt";
		}

		if (userConnected == preteur.id) {
			returnObj.titleRequested = emprunteur.fullName + " souhaite vous emprunter le livre.";
			returnObj.titleCurrent = "Vous avez accepté la demande de " + emprunteur.fullName + ". Merci de lui faire parvenir le livre.";
			returnObj.titleSent = emprunteur.fullName + " vous a renvoyé le livre. Merci de clore l'emprunt si vous l'avez bien reçu.";
			returnObj.titleRefus = "Vous a refusé cette demande avec le motif " + motif;
			returnObj.titleCloture = "Vous avez cloturé l'emprunt";
		}

		return returnObj;
	}

	render() {
		if (!this.props.loan || !this.state.events ) {
			return "";
    }
    const events = this.state.events;
    const userConnected = this.props.userId;
    if(!userConnected) {
      return "";
    }
		const emprunteur = this.props.loan.emprunteur;
		const preteur = this.props.loan.preteur;

    const isActive = !(this.props.loan.dateCloture || this.props.loan.dateRefus)
		let displayAddRating = false;
		if (userConnected == emprunteur.id && this.props.loan.livre && !this.props.avis && isActive &&
			(this.props.loan.livre.statut == loanStatus.CURRENT || this.props.loan.livre.statut == loanStatus.SENT)) {
			displayAddRating = true;
    }
    
		return (
			<div className="container-timeline">
				<div className="header-timeline">
					{isActive && <AddComment
						idLoan={this.props.loan.id}
						reloadEmprunt={this.props.reloadEmprunt}
						destinataire={userConnected == preteur.id ? emprunteur.fullName : preteur.fullName}
            displaySpinner={this.props.displaySpinner}
            hideSpinner={this.props.hideSpinner}
            >
					</AddComment>}
					{displayAddRating &&
						<AddAvis
							visibleByDefault={false}
							bookModelId={this.props.loan.livreModel.id}
              reloadEmprunt={this.props.reloadEmprunt}
              displaySpinner={this.props.displaySpinner}
              hideSpinner={this.props.hideSpinner}
						/>}
				</div>
				<div className="timeline">
					<Timeline>
						{this.displayEvents(events, userConnected, isActive)}
					</Timeline>
				</div>
			</div>
    )
	}
}

export default withRouter(LoanAttributes)
