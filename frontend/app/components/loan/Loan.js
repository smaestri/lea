import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import formatDate from '../../helpers/utils'
import ButtonsEmprunt from './ButtonsEmprunt'
import './Loan.scss'

class Loan extends React.Component {

	render() {
    let livremodel = {};
    if(this.props.loan.livreModel) {
			livremodel =this.props.loan.livreModel;
		} else {
			return "";
    }
    let dateDemande = formatDate(this.props.loan.dateDemande);
    let dateAccept = formatDate(this.props.loan.dateAccept);
    let dateSent = formatDate(this.props.loan.dateEnvoi);
    let dateRefus = formatDate(this.props.loan.dateRefus);
    let dateCloture = formatDate(this.props.loan.dateCloture);

    const userIsLender = this.props.userId == this.props.loan.preteur.id;

		return (
      <div className="loan-container">
        <div className="title-book form-horizontal">
	        {livremodel.titreBook}
				</div>
        <div className="image-container">
          <div className="image-content">
            <img className="img" src={livremodel.image} />
          </div>
        </div>
        <div className="form-horizontal">
          {!userIsLender && dateDemande && !dateAccept && !dateSent && !dateRefus && !dateCloture &&
            `Vous avez fait la demande ${dateDemande}`}
          {userIsLender && dateDemande && !dateAccept && !dateSent && !dateRefus && !dateCloture &&
           `Demandé ${dateDemande}`}
          
          {userIsLender && dateAccept && !dateSent && !dateRefus && !dateCloture &&
            `Vous avez acceptée l'emprunt ${dateAccept}, merci de l'envoyer!`}
          {!userIsLender && dateAccept && !dateSent && !dateRefus && !dateCloture &&
           `${this.props.loan.preteur.fullName} a accepté l'emprunt ${dateAccept}`}
          
          {!userIsLender && dateSent && !dateRefus && !dateCloture &&
           `Vous avez renvoyé le livre de ${this.props.loan.emprunteur.fullName} ${dateSent}`}
          {userIsLender && dateSent && !dateRefus && !dateCloture &&
           `${this.props.loan.preteur.fullName} a renvoyé votre livre ${dateSent}`}

          {userIsLender && dateRefus && `Vous avez refusé l'emprunt le ${dateRefus}.`}
          {!userIsLender && dateRefus && `${this.props.loan.preteur.fullName} a refusé votre demande le ${dateRefus}.`}

          {!userIsLender && dateCloture && `Demande close par ${this.props.loan.preteur.fullName} ${dateAccept}`}
          {userIsLender && dateCloture && `Vous avez cloturé l'emprunt ${dateAccept}`}
				</div>
        <div className="form-horizontal">
	        {!userIsLender && `Preteur: ${this.props.loan.preteur.fullName}`}
          {userIsLender && `Emprunteur: ${this.props.loan.emprunteur.fullName}`}
				</div>
        <div className="linkBook">
					<Link to={'/loan-detail/' + this.props.loan.id}>Détail de l'emprunt</Link>
				</div>
        <div className="loan-buttons">
							{this.props.loan && !(this.props.loan.dateCloture || this.props.loan.dateRefus) &&
							<ButtonsEmprunt
								loan={this.props.loan}
								reloadEmprunt={this.props.reloadEmprunt}
								onRefreshCount={this.props.onRefreshCount}
                userId={this.props.userId}
                displaySpinner={this.props.displaySpinner}
                hideSpinner={this.props.hideSpinner}
							/>}
        </div>
    </div>
		
		)
	}
}

export default withRouter(Loan)
