import React from 'react'
import helpers from '../helpers/api'
import Comment from './Comment'
import AddComment from './AddComment'
import AddAvis from './AddAvis'
import { withRouter } from 'react-router';

class LoanDetail extends React.Component {

    constructor(props) {
        super(props);
        this.acceptLoan = this.acceptLoan.bind(this);
        this.sendLoan = this.sendLoan.bind(this);
        this.closeLoan = this.closeLoan.bind(this);
        this.saveComment = this.saveComment.bind(this);
        this.saveEditComment = this.saveEditComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.state = {loan:{}};

    }

    //force refresh
    componentDidMount(forceRefresh){
        console.log('componentDidMount loan detazil')
        let loan;

        // Get loan or lending in cache
        if(!forceRefresh){
            loan= helpers.getLoan(this.props.params.loanId);
            if(loan){
                if(Object.keys(this.state.loan).length==0){
                    this.setState({loan:loan })
                }
            }
        // if not found in cache, call all get loans or lendings and set curent one
        }else {
            console.log('force refresh')
            if (this.props.params.isLending == 'true') {
                console.log('call get lendins')
                helpers.getLendings().then(() => {
                    let lending = helpers.getLoan(this.props.params.loanId);
                    this.setState({loan: lending})
                })
            }
            else {
                console.log('call get loans')
                helpers.getLoans().then(() => {
                    let loan = helpers.getLoan(this.props.params.loanId);
                    this.setState({loan: loan})
                })
            }
        }
    }

    saveComment(commObj){
        helpers.saveComment(commObj, null, this.props.params.loanId).then((comm) => {
            console.log('redirect to laon details');
            console.log(comm)
            this.componentDidMount(true);
        });
    }

    deleteComment(commId){
        helpers.deleteComment(commId).then((comm) => {
            console.log('redirect to laon details');
            console.log(comm)
            this.componentDidMount(true);

        });
    }

    saveEditComment(commObj, idComm){
        helpers.saveComment(commObj, idComm, this.props.params.loanId).then((comm) => {
            console.log('redirect to laon details');
            console.log(comm)
            this.componentDidMount(true);
        });
    }

    acceptLoan(){
        helpers.acceptLoan(this.props.params.loanId).then(() => {
            this.componentDidMount(true);
        });
    }

    sendLoan(){
        helpers.sendLoan(this.props.params.loanId).then(() => {
            this.componentDidMount(true);
        });
    }

    closeLoan(){
        helpers.closeLoan(this.props.params.loanId).then(() => {
            this.props.router.push('/my-lendings')
        });
    }

    render() {
        console.log('render');
        console.log(this.state.loan)
        let displayAcceptButton, displayCloseButton, displayLoanRequestedText, displayDetailButton, displaySendButton, displayLoanSentText, displayLoanSentTextByProp= false;
        const loan = this.state.loan;
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

        //get comments
        const comments = loan.commentaires.map( comment => {
            let displayButtons = false;
            // display edit and delete buttons for comments
            if(comment.auteur == userConnected){
                displayButtons=true;
            }

            return <Comment key={comment.id} id={comment.id} message={comment.message} dateMessage={comment.dateMessage} auteur={comment.user.fullName} displayButtons={displayButtons} deleteComment={this.deleteComment} saveEditComment={this.saveEditComment}/>
        });

        //Si actif= false ne rien afficher

        let title = null;
        if(this.props.params.isLending == 'true'){
           title = <span>Pret:</span>
        }
        else{
            title = <span>Emprunt:</span>
        }

        //Get rating for this book and this user
        let rating =0 ;
        loan.livre.avis.forEach ( (avis) => {
            console.log("todo");
            if(avis.auteur == loan.emprunteur.id){
                rating = avis.note;
                //TODO perf
            }
        });

        return (
            <div>
                <div>{title} {loan.id}</div>
                - emprunteur : {loan.emprunteur.fullName}
                - Preteur : {loan.preteur.fullName}
                - Livre : {loan.livre.titreBook}
                - Date demande: {loan.dateDemande}
                - Statut:  {loan.livre.statut}
                - {displayAcceptButton && <button onClick={this.acceptLoan}>Accepter</button>}
                - {displaySendButton && <button onClick={this.sendLoan}>Renvoyer</button>}
                - {displayLoanSentText && <span>Vous avez renvoyé le livre à son proprietaire le TODO </span>}
                - {displayLoanRequestedText && <span>Vous avez demandé ce livre le {loan.dateDemande}</span>}
                - {displayLoanSentTextByProp && <span>L'emprunteur vous a renvoyé le livre. Si vous l'avez bien reçu, vous pouvez clore cet emprunt, qui apparaitra dans votre historique.</span>}
                - {displayCloseButton && <button onClick={this.closeLoan}>Clore</button>}
                { (displaySendButton || displayLoanSentText) && <div>Noter ce livre</div>}
                { (displaySendButton || displayLoanSentText) && <AddAvis bookId={loan.livre.id} initialRate={rating} />}
                <div>Commentaires entre vous et l'emprunteur / preteur</div>
                <div>
                    <ul>{comments}</ul>
                    <AddComment loanId={loan.id} saveComment={this.saveComment}></AddComment>
                </div>
            </div>
        )
    }
}

export default withRouter(LoanDetail)
