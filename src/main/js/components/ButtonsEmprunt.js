import React from 'react'
import helpers from '../helpers/api'
import {Button} from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'
import { withRouter } from 'react-router'

class ButtonsEmprunt extends React.Component {

    constructor(props) {
        super(props);
        this.acceptLoan = this.acceptLoan.bind(this);
        this.refuseLoan = this.refuseLoan.bind(this);
        this.sendLoan = this.sendLoan.bind(this);
        this.closeLoan = this.closeLoan.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {motifRefus: '', disableAcceptButton: false, disableSendButton: false, disableCloseButton: false};
    }

    acceptLoan(){
        this.setState({disableAcceptButton: true });
        helpers.acceptLoan(this.props.loan.id).then(() => {
            this.props.reloadEmprunt();
        });
    }

    refuseLoan(){

        if (this.state.motifRefus ==''){
            alert('Veuillez renseigner un motif de refus SVP.');
            return;
        }
        this.setState({disableAcceptButton: true });
        helpers.refuseLoan(this.props.loan.id, this.state.motifRefus).then(() => {
            this.props.onRefreshCount();
            this.props.router.push('/historized-lendings')
        });
    }

    sendLoan(){
        this.setState({disableSendButton: true });
        helpers.sendLoan(this.props.loan.id).then(() => {
            this.props.reloadEmprunt();
        });
    }

    closeLoan(){
        this.setState({disableCloseButton: true });
        helpers.closeLoan(this.props.loan.id).then(() => {
            // update home to get new number of lendings
            this.props.onRefreshCount();
            this.props.router.push('/historized-lendings')
        });
    }

    handleChange(event){
        this.setState({motifRefus: event.target.value });
    }

    render() {
        let displayAcceptButton, displayCloseButton, displayLoanRequestedText, displayDetailButton, displaySendButton, displayLoanSentText, displayLoanSentTextByProp, displayTextCurrent= false;
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

        //Si statut = CURRENT et je suis preteur => afficher livre en cours de l'cture par
        if(loan.livre.statut == 'CURRENT' && userConnected == loan.preteur.id){
            displayTextCurrent  = true;
        }

        //Si statut = SENT et je suis preteur => afficher le proprietaire vous a renvoyé ce livr ele .... + CLORE
        if(loan.livre.statut == 'SENT' && userConnected == loan.preteur.id){
            displayLoanSentTextByProp = true;
            displayCloseButton = true;
        }

        return (
            <div>
                {displayTextCurrent && <div>Livre en cours de lecture par l'emprunteur </div>}
                {displayLoanSentText && <div>Vous avez renvoyé le livre à son proprietaire le TODO </div>}
                {displayLoanRequestedText && <div>Vous avez demandé ce livre le {loan.dateDemande}</div>}
                {displaySendButton && <div>Vous êtes en train de lire ce livre. Renvoyer le à son propriétaire une fois terminé!</div>}
                {displayAcceptButton && <Button bsStyle="primary" bsSize="small" onClick={this.acceptLoan} disabled={this.state.disableAcceptButton}>Accepter</Button>}
                {displayAcceptButton && <div>Si vous souhaitez refuser cet emprunt, veuillez indiquer un motif de refus et cliquer sur le boutton refuser</div>}
                {displayAcceptButton &&   <FormControl componentClass="textarea" placeholder="Motif du refus" onChange={this.handleChange} />}
                {displayAcceptButton && <Button bsStyle="primary" bsSize="small" onClick={this.refuseLoan} disabled={this.state.disableAcceptButton}>Refuser</Button>}
                {displaySendButton &&  <Button bsStyle="primary" bsSize="small" onClick={this.sendLoan} disabled={this.state.disableSendButton}>Renvoyer</Button>}
                {displayLoanSentTextByProp && <div>L'emprunteur vous a renvoyé le livre. Si vous l'avez bien reçu, vous pouvez clore cet emprunt, qui apparaitra dans votre historique.</div>}
                {displayCloseButton &&  <Button bsStyle="primary" bsSize="small" onClick={this.closeLoan} disabled={this.state.disableCloseButton}>Clore</Button>}
            </div>
        )
    }
}

export default withRouter(ButtonsEmprunt)
