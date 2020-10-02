import React from 'react';
import Loan from '../loan/Loan'
import helpers from '../../helpers/loan/api'
import FilterLoan from './FilterLoan'

import './MyLoans.scss'

class MyLoans extends React.Component {

	constructor(props) {
		super(props);
    this.state = { loanActives: [], loanHistorized:[], displayActive : true };
    this.clickActive = this.clickActive.bind(this);
    this.clickInactive = this.clickInactive.bind(this);
		this.loadEmprunt = this.loadEmprunt.bind(this);
	}

	loadEmprunt() {
    this.props.displaySpinner()
    // TODO load only somme info, not all things
		helpers.getLoans().then((loans) => {
      this.props.hideSpinner()
      loans = loans.reverse();
      const loanActives = loans.filter(loan => (!(loan.dateCloture || loan.dateRefus)));
      const loanHistorized = loans.filter(loan => (loan.dateCloture || loan.dateRefus));

			this.setState({
        loanActives: loanActives,
        loanHistorized: loanHistorized
			});
			// refresh emprunt : refresh notif
			this.props.onRefreshNotif();
		});
	}

	componentDidMount() {
		this.loadEmprunt();
		this.props.onRefreshCount();
  }
  
  clickActive(event) {
    event.preventDefault();
    this.setState({
      displayActive: true,
    });
  }

  clickInactive(event) {
    event.preventDefault();
    this.setState({
      displayActive: false,
    });
  }

	render() {
    if(!this.state.loanActives ) {
      return "";
    }
		const loansActives = this.state.loanActives.map(loan => {
			return <Loan
						key={loan.id}
						id={loan.id}
						loan={loan}
						onRefreshCount={this.props.onRefreshCount}
						reloadEmprunt={this.loadEmprunt}
            userId={this.props.userId}
            displaySpinner={this.props.displaySpinner}
            hideSpinner={this.props.hideSpinner}
					/>
    });
    
    const loanHistorized = this.state.loanHistorized.map(loan => {
			return <Loan
						key={loan.id}
						id={loan.id}
						loan={loan}
						onRefreshCount={this.props.onRefreshCount}
						reloadEmprunt={this.loadEmprunt}
            userId={this.props.userId}
            displaySpinner={this.props.displaySpinner}
            hideSpinner={this.props.hideSpinner}
					/>
		});
		return (
      <section>
        <div className="container">

          <FilterLoan 
            displayActive={this.state.displayActive}
            loanHistorized={loanHistorized}
            loansActives={loansActives}
            clickInactive={this.clickInactive}
            clickActive={this.clickActive}
          ></FilterLoan>

          {this.state.displayActive && <div className="row justify-content-center">
            <div className="col d-flex flex-wrap justify-content-center">
              {loansActives.length == 0 && <span>Vous n'avez pas d'emprunts en cours.</span>}
              {loansActives.length > 0 && <div className="myloans-container">{loansActives}</div>}
            </div>
          </div>}
           {!this.state.displayActive && <div className="col d-flex flex-wrap justify-content-center">
            {loanHistorized.length == 0 && <span>Vous n'avez pas d'emprunts historisés.</span>}
            {loanHistorized.length > 0 && <div className="myloans-container">{loanHistorized}</div>}
          </div>}
        </div>
      </section>
		)
	}
}

export default MyLoans
