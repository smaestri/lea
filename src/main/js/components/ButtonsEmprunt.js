import React from 'react'
import helpers from '../helpers/api'
import {Button} from 'react-bootstrap'
import { withRouter } from 'react-router'

class ButtonsEmprunt extends React.Component {

    constructor(props) {
        super(props);
        this.acceptLoan = this.acceptLoan.bind(this);
        this.sendLoan = this.sendLoan.bind(this);
        this.closeLoan = this.closeLoan.bind(this);
    }

    acceptLoan(){
        helpers.acceptLoan(this.props.loan.id).then(() => {
            this.props.reloadEmprunt();
        });
    }

    sendLoan(){
        helpers.sendLoan(this.props.loan.id).then(() => {
            this.props.reloadEmprunt();
        });
    }

    closeLoan(){
        helpers.closeLoan(this.props.loan.id).then(() => {
            this.props.router.push('/my-lendings')
        });
    }

    render() {
        let displayAcceptButton, displayCloseButton, displayLoanRequestedText, displayDetailButton, displaySendButton, displayLoanSentText, displayLoanSentTextByProp= false;
        const loan = this.props.loan;
        const userConnected = document.getElementById("userId").value;

        if (!loan || !loan.livre){
            return null;
        }

        //si statut = REQUESTED et je suis empreteur => afficher "vous avez demandé ce livre le ..."
        if(loan.livre.statut == 'REQUESTED' && userConnected == loan.emprunteur.id){
            displayLoanRequestedText = true;
        }

        //si statut = REQUESTED et je suis preteur => afficher bouton ******ACCEPTER****
        if(loan.livre.statut == 'REQUESTED' && userConnected == loan.preteur.id){
            displayAcceptButton = true;
        }

        // si statut = CURRENT et je suis emprunteur => afficher bouton ****RENVOYER***
        if(loan.livre.statut == 'CURRENT' && userConnected == loan.emprunteur.id){
            displaySendButton = true;
        }
        //Si statut = SENT et je suis emprunteur => afficher vosu avez renvoyé ce livre à son propiretaire le ....
        if(loan.livre.statut == 'SENT' && userConnected == loan.emprunteur.id){
            displayLoanSentText = true;
        }

        if(loan.livre.statut == 'CURRENT' || loan.livre.statut == 'SENT'){
            displayDetailButton = true;
        }

        //Si statut = SENT et je suis preteur => afficher le proprietaire vous a renvoyé ce livr ele .... + CLORE
        if(loan.livre.statut == 'SENT' && userConnected == loan.preteur.id){
            displayLoanSentTextByProp = true;
            displayCloseButton = true;
        }

        return (
            <div>
                {displayLoanSentText && <div>Vous avez renvoyé le livre à son proprietaire le TODO </div>}
                {displayLoanRequestedText && <div>Vous avez demandé ce livre le {loan.dateDemande}</div>}
                {displaySendButton && <div>Vous êtes en train de lire ce livre. Renvoyer le à son propriétaire une fois terminé!</div>}
                {displayAcceptButton && <Button bsStyle="primary" bsSize="small" onClick={this.acceptLoan}>Accepter</Button>}
                {displaySendButton &&  <Button bsStyle="primary" bsSize="small" onClick={this.sendLoan}>Renvoyer</Button>}
                {displayLoanSentTextByProp && <Button>L'emprunteur vous a renvoyé le livre. Si vous l'avez bien reçu, vous pouvez clore cet emprunt, qui apparaitra dans votre historique.</Button>}
                {displayCloseButton &&  <Button bsStyle="primary" bsSize="small" onClick={this.closeLoan}>Clore</Button>}
            </div>
        )
    }
}

export default withRouter(ButtonsEmprunt)
