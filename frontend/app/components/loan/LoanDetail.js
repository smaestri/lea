import React from 'react'
import { withRouter } from 'react-router'
import ButtonsEmprunt from './ButtonsEmprunt'
import LoanAttributes from './LoanAttributes'
import { renderHTML} from '../../helpers/utils'
import helpers from '../../helpers/loan/api'
import {loadSvg} from '../../helpers/utils'

import './LoanDetail.scss'

class LoanDetail extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
         loan: {}
      };
      this.loadEmprunt = this.loadEmprunt.bind(this);
  }


  componentDidUpdate() {
    loadSvg();
  }

  componentDidMount(){
    this.loadEmprunt();
  }

  loadEmprunt() {
    helpers.getLoan(this.props.match.params.loanId).then((loan) => {
			this.setState({
				loan
      });
      loadSvg();
		});
  }

	render() {
		const userConnected = this.props.userId;
    let livremodel = {};
    if(!userConnected) {
      return "";
    }
		if(this.state.loan && this.state.loan.livreModel) {
      livremodel = this.state.loan.livreModel;
		} else {
			return "";
    }

    let dateFin = this.state.loan.dateCloture;
    if(this.state.loan.dateRefus){
      dateFin = this.state.loan.dateRefus;
    }

		let avis = livremodel.avis.find( avisBook => (
				 (this.state.loan.emprunteurId == avisBook.auteur && avisBook.dateavis >= this.state.loan.dateDemande &&
					 (dateFin == undefined || avisBook.dateavis <= dateFin))
    ));

		return (
      <section>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col d-flex flex-wrap justify-content-center">
              <div className="loan-detail-container">
                <div className="loan-header">{renderHTML(livremodel.titreBook)}</div>
                <div className="loan-content">
                  <div className="image-container">
                    <div className="image-content">
                      <img className="img" src={livremodel.image}/>
                    </div>
                  </div>
                  <div className="loan-main">
                    <div className="loan-buttons">
                      {!this.state.loan && !(this.state.loan.dateCloture || this.state.loan.dateRefus) &&
                      <ButtonsEmprunt
                        loan={this.state.loan}
                        reloadEmprunt={this.loadEmprunt}
                        onRefreshCount={this.props.onRefreshCount}
                        userId={this.props.userId}
                        displaySpinner={this.props.displaySpinner}
                        hideSpinner={this.props.hideSpinner}
                      />}
                    </div>
                    <div className="loan-details">
                      <LoanAttributes
                        loan={this.state.loan}
                        userId={userConnected}
                        reloadEmprunt={this.loadEmprunt}
                        avis={avis}
                        displaySpinner={this.props.displaySpinner}
                        hideSpinner={this.props.hideSpinner}
                      />
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
		)
	}
}

export default withRouter(LoanDetail)
