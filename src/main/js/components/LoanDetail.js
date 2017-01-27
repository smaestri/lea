import React from 'react'
import helpers from '../helpers/api'
import Comment from './Comment'
import AddComment from './AddComment'
import ButtonsEmprunt from './ButtonsEmprunt'
import AddAvis from './AddAvis'
import { withRouter } from 'react-router';
import '../../webapp/assets/css/emprunt-detail.scss'

class LoanDetail extends React.Component {

    constructor(props) {
        super(props);
        this.saveComment = this.saveComment.bind(this);
        this.saveEditComment = this.saveEditComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.state = {loan:{}};
    }

    //force refresh
    componentDidMount(forceRefresh){
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
            if (this.props.params.isLending == 'true') {
                helpers.getLendings().then(() => {
                    let lending = helpers.getLoan(this.props.params.loanId);
                    this.setState({loan: lending})
                })
            }
            else {
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
            console.log('reload laon details');
            this.componentDidMount(true);
        });
    }

    refreshEmprunt(){
        this.componentDidMount(true);
    }

    render() {

        // if no loan return
        const loan = this.state.loan;
        if (!loan || !loan.livre){
            return null;
        }

        //get comments
        const comments = loan.commentaires.map( comment => {
            let displayButtons = false;
            // display edit and delete buttons for comments
            if(comment.auteur == userConnected){
                displayButtons=true;
            }

            return <Comment key={comment.id}
                            id={comment.id}
                            message={comment.message}
                            dateMessage={comment.dateMessage}
                            auteur={comment.user.fullName}
                            displayButtons={displayButtons}
                            deleteComment={this.deleteComment}
                            saveEditComment={this.saveEditComment}/>
        });

        //Si actif= false ne rien afficher

        let title = null;
        let typeEmprunt = "le prêteur";
        let isEmprunteur = true;
        if(this.props.params.isLending == 'true'){
            isEmprunteur = false;
            typeEmprunt = "l'emprunteur";
           title = <span>Pret du livre {loan.livre.titreBook} </span>
        }
        else{
            title = <span>Emprunt du livre {loan.livre.titreBook}</span>
        }

        //Get rating for this book and this user
        let avis ={} ;
        loan.livre.avis.forEach ( (avisBook) => {
            if(avisBook.auteur == loan.emprunteur.id){
                avis = avisBook;
                //TODO perf
            }
        });

        let displayRating = false;
        if(loan.livre.statut == 'CURRENT' || loan.livre.statut == 'SENT'){
            displayRating = true;
        }

        return (
            <div>
                <h1>{title}</h1>
                <div className="content-emprunt">
                    <div className="emprunt-information">
                        {!isEmprunteur && <div>emprunteur : {loan.emprunteur.fullName}</div>}
                        {isEmprunteur && <div>Preteur : {loan.preteur.fullName}</div>}
                        <div>Date demande: {loan.dateDemande}</div>
                        <ButtonsEmprunt loan={loan} reloadEmprunt={this.refreshEmprunt} />
                        {displayRating &&  <div>Noter ce livre</div>}
                        {displayRating &&  <AddAvis bookId={loan.livre.id} avis={avis} />}
                    </div>
                    <div className="emprunt-comments">
                        <div>Commentaires entre vous et {typeEmprunt}</div>
                        <ul>{comments}</ul>
                        <AddComment loanId={loan.id} saveComment={this.saveComment}></AddComment>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(LoanDetail)
