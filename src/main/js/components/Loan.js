import React from 'react'
import { withRouter } from 'react-router';
import { Link } from 'react-router';

class Loan extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li>{this.props.isLending && <span>Pret:</span>}
                {!this.props.isLending && <span>Emprunt:</span>} {this.props.id}
                - emprunteur : {this.props.loan.emprunteur.fullName}
                - Preteur : {this.props.loan.preteur.fullName}
                - Livre : {this.props.loan.livre.titreBook}
                - Date demande: {this.props.loan.dateDemande}
                - Statut:  {this.props.loan.livre.statut}
                {!this.props.isHistory &&  <Link to={'loan-detail/' + this.props.id + '/' + this.props.isLending}>Détails</Link>}
            </li>
        )
    }
}

export default withRouter(Loan)
