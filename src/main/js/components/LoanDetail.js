import React from 'react'
import helpers from '../helpers/api'
import Comment from './Comment'
import AddComment from './AddComment'
import ButtonsEmprunt from './ButtonsEmprunt'
import AddAvis from './AddAvis'
import LoanAttributes from './LoanAttributes'
import { withRouter } from 'react-router'
import {Button} from 'react-bootstrap'
import '../../webapp/assets/css/emprunt-detail.scss'

class LoanDetail extends React.Component {

    constructor(props) {
        super(props);
        this.saveComment = this.saveComment.bind(this);
        this.saveEditComment = this.saveEditComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.refreshEmprunt = this.refreshEmprunt.bind(this);
        this.returnToLoans = this.returnToLoans.bind(this);
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
        helpers.saveComment(commObj, null, this.props.params.loanId).then(() => {
            this.componentDidMount(true);
        });
    }

    deleteComment(commId){
        helpers.deleteComment(commId).then(() => {
            this.componentDidMount(true);

        });
    }

    saveEditComment(commObj, idComm){
        helpers.saveComment(commObj, idComm, this.props.params.loanId).then(() => {
            this.componentDidMount(true);
        });
    }

    refreshEmprunt(){
        this.componentDidMount(true);
    }

    returnToLoans() {
        if(this.props.params.isLending == 'true'){
            this.props.router.push('/my-lendings');
        }
        else{
            this.props.router.push('/my-loans')
        }
    }

    render() {
        // if no loan return
        const loan = this.state.loan;
        if (!loan || !loan.livre){
            return null;
        }

        //get comments
        const userConnected = document.getElementById("userId").value;
        const comments = loan.commentaires.map( comment => {
            let displayButtons = false;
            // display edit and delete buttons for comments
            if(comment.auteur == userConnected){
                displayButtons=true;
            }

            let message ='';
            if(comment.message) {
                message = comment.message;
            }
            return <Comment key={comment.id}
                            id={comment.id}
                            message={message}
                            dateMessage={comment.dateMessage}
                            auteur={comment.user.fullName}
                            displayButtons={displayButtons}
                            deleteComment={this.deleteComment}
                            saveEditComment={this.saveEditComment}/>
        });

        let title = null;
        let typeEmprunt = "le prêteur";
        let isEmprunteur = true;
        if(this.props.params.isLending == 'true'){
            isEmprunteur = false;
            typeEmprunt = "l'emprunteur";
           title = <span>Prêt du livre <i>{loan.livre.titreBook}</i> </span>
        }
        else{
            title = <span>Emprunt du livre <i>{loan.livre.titreBook}</i></span>
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
        if (userConnected == loan.emprunteur.id && (loan.livre.statut == 'CURRENT' || loan.livre.statut == 'SENT') ){
            displayRating = true;
        }
        return (
            <div className="main-content">
                <h1>{title}</h1>
                <div className="content-emprunt">
                    <div className="emprunt-information">
                        <LoanAttributes loan={loan} isHistory={false} isLending={this.props.params.isLending} displayLinks={false} />
                        <ButtonsEmprunt loan={loan} onRefreshCount={this.props.onRefreshCount} reloadEmprunt={this.refreshEmprunt} />
                        {displayRating &&  <h3>Noter ce livre</h3>}
                        {displayRating &&  <AddAvis bookId={loan.livre.id} avis={avis} />}
                    </div>
                    <div className="emprunt-comments">
                        <h3>Commentaires entre vous et {typeEmprunt}</h3>
                        <ul>{comments}</ul>
                        <AddComment loanId={loan.id} saveComment={this.saveComment}></AddComment>
                    </div>
                </div>
                <Button bsStyle="primary" onClick={this.returnToLoans}>Retour</Button>
            </div>
        )
    }
}

export default withRouter(LoanDetail)
