import React from 'react'
import { withRouter } from 'react-router';
import { Link } from 'react-router';
import ButtonsEmprunt from './ButtonsEmprunt';
import '../../webapp/assets/css/loans.scss';
import '../../webapp/assets/css/button.scss';

class Loan extends React.Component {

    render() {

        let envoyerMessage = "Noter ce livre ou envoyer message au prêteur";
        if(this.props.isLending){
            envoyerMessage = "Détails et envoyer message à l'emprunteur"
        }

        return (
            <div className="loan">
                {this.props.isLending && <div>Emprunteur : {this.props.loan.emprunteur.fullName}</div>}
                {!this.props.isLending && <div>Preteur : {this.props.loan.preteur.fullName}</div>}
                <div>Livre : {this.props.loan.livre.titreBook}</div>
                <div>Date demande: {this.props.loan.dateDemande}</div>
                <div>{!this.props.isHistory &&
                    <Link to={'loan-detail/' + this.props.id + '/' + this.props.isLending}>{envoyerMessage}</Link>}
                </div>
                <div>
                    {!this.props.isHistory && <ButtonsEmprunt loan={this.props.loan} reloadEmprunt={this.props.reloadEmprunt} onRefreshCount={this.props.onRefreshCount}  />}
                </div>
                <div>
                    {this.props.isHistory && this.props.loan.motifRefus && <span>prêt refusé par le propriétaire du livre avec le motif: {this.props.loan.motifRefus}</span>}
                </div>
            </div>
        )
    }
}

export default withRouter(Loan)
