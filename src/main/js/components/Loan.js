import React from 'react'

class Loan extends React.Component {

    constructor(props) {
        super(props);
        this.acceptLoan = this.acceptLoan.bind(this);
        this.sendLoan = this.sendLoan.bind(this);
        this.closeLoan = this.closeLoan.bind(this);
    }
    // props only set for mylendings
    acceptLoan(){
        this.props.acceptLoan(this.props.loan.id);
    }

    // props only set for myloans
    sendLoan(){
        this.props.sendLoan(this.props.loan.id);
    }

    // props only set for mylendings
    closeLoan(){
        this.props.closeLoan(this.props.loan.id);
    }

    render() {

        let displayAcceptButton, displayCloseButton, displayLoanRequestedText, displaySendButton, displayLoanSentText, displayLoanSentTextByProp= false;
        const loan = this.props.loan;
        const userConnected = document.getElementById("userId").value;

        //si statut = REQUESTED et je suis empreteur => afficher "vous avez demandé ce livre le ..."
        if(loan.livre.statut == 'REQUESTED' && userConnected == this.props.loan.emprunteur.id){
            displayLoanRequestedText = true;
        }

        //si statut = REQUESTED et je suis preteur => afficher bouton ******ACCEPTER****
        if(loan.livre.statut == 'REQUESTED' && userConnected == this.props.loan.preteur.id){
            displayAcceptButton = true;
        }

        // si statut = CURRENT et je suis emprunteur => afficher bouton ****RENVOYER***
        if(loan.livre.statut == 'CURRENT' && userConnected == this.props.loan.emprunteur.id){
            displaySendButton = true;
        }
        //Si statut = SENT et je suis emprunteur => afficher vosu avez renvoyé ce livre à son propiretaire le ....
        if(loan.livre.statut == 'SENT' && userConnected == this.props.loan.emprunteur.id){
            displayLoanSentText = true;
        }

        //Si statut = SENT et je suis preteur => afficher le proprietaire vous a renvoyé ce livr ele .... + CLORE
        if(loan.livre.statut == 'SENT' && userConnected == this.props.loan.preteur.id){
            displayLoanSentTextByProp = true;
            displayCloseButton = true;
        }

        //Si actif= false ne rien afficher
        return (
            <li>Emprunt: {this.props.id}
                - emprunteur : {this.props.loan.emprunteur.fullName}
                - Preteur : {this.props.loan.preteur.fullName}
                - Livre : {this.props.loan.livre.titreBook}
                - Date demande: {this.props.loan.dateDemande}
                - Statut:  {this.props.loan.livre.statut}
                - {displayAcceptButton && <button onClick={this.acceptLoan}>Accepter</button>}
                - {displaySendButton && <button onClick={this.sendLoan}>Renvoyer</button>}
                - {displayLoanSentText && <span>Vous avez renvoyé le livre à son proprietaire le TODO </span>}
                - {displayLoanRequestedText && <span>Vous avez demandé ce livre le {this.props.loan.dateDemande}</span>}
                - {displayLoanSentTextByProp && <span>L'emprunteur vous a renvoyé le livre. Si vous l'avez bien reçu, vous pouvez clore cet emprunt, qui apparaitra dans votre historique.</span>}
                - {displayCloseButton && <button onClick={this.closeLoan}>Clore</button>}
            </li>
        )
    }
}

export default Loan
