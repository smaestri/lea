import React from 'react'
import formatDate from '../helpers/utils'
import { Link } from 'react-router'

class LoanAttributes extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let envoyerMessage = "Noter le livre / Echanger avec le prêteur";
        if(this.props.isLending){
            envoyerMessage = "Détails et envoyer message à l'emprunteur"
        }
        else{
            if(this.props.loan.livre.statut == 'REQUESTED'){
                envoyerMessage =  "Echanger avec le prêteur";
            }
        }

        let displayTextCurrent, displayLoanSentTextByProp, displayLoanRequestedText,displaySendText = false;
        const userConnected = document.getElementById("userId").value;

        //Si statut = CURRENT et je suis preteur => afficher livre en cours de l'cture par
        if(!this.props.isHistory && this.props.loan.livre.statut == 'CURRENT' && userConnected == this.props.loan.preteur.id){
            displayTextCurrent  = true;
        }

        //Si statut = SENT et je suis preteur => afficher le proprietaire vous a renvoyé ce livr ele .... + CLORE
        if(!this.props.isHistory && this.props.loan.livre.statut == 'SENT' && userConnected == this.props.loan.preteur.id){
            displayLoanSentTextByProp = true;
        }

        //si statut = REQUESTED et je suis empreteur => afficher "vous avez demandé ce livre le ..."
        if(!this.props.isHistory && this.props.loan.livre.statut == 'REQUESTED' && userConnected == this.props.loan.emprunteur.id){
            displayLoanRequestedText = true;
        }

        // si statut = CURRENT et je suis emprunteur => afficher bouton ****RENVOYER***
        if(!this.props.isHistory && this.props.loan.livre.statut == 'CURRENT' && userConnected == this.props.loan.emprunteur.id){
            displaySendText = true;
        }

        var isLending = (this.props.isLending == 'true');

        return (
            <ul className="pin">
                {isLending && <li>Emprunteur : {this.props.loan.emprunteur.fullName}</li>}
                {!isLending && <li>Prêteur : {this.props.loan.preteur.fullName}</li>}
                <li>Demande effectuée le {formatDate(this.props.loan.dateDemande)} par {this.props.loan.emprunteur.fullName}</li>
                {this.props.loan.dateAccept && <li>Demande acceptée le {formatDate(this.props.loan.dateAccept)} par {this.props.loan.preteur.fullName}</li>}
                {this.props.loan.dateEnvoi && <li>Livre renvoyé le {formatDate(this.props.loan.dateEnvoi)} par {this.props.loan.emprunteur.fullName}</li>}
                {displayTextCurrent && <li>Livre en cours de lecture par l'emprunteur </li>}
                {this.props.isHistory && this.props.loan.motifRefus && <li>Prêt refusé le {formatDate(this.props.loan.dateRefus)} par {this.props.loan.preteur.fullName} avec le motif: {this.props.loan.motifRefus}</li>}
                {this.props.isHistory && !this.props.loan.motifRefus && <li>Prêt clos le {formatDate(this.props.loan.dateCloture)}  par {this.props.loan.preteur.fullName}</li>}
                {displaySendText && <li>Vous êtes en train de lire ce livre. Renvoyer le à son propriétaire une fois terminé!</li>}
                {this.props.displayLinks  && !this.props.isHistory && <Link to={'loan-detail/' + this.props.loan.id + '/' + isLending}>{envoyerMessage}</Link>}
            </ul>
        )
    }
}

export default LoanAttributes
