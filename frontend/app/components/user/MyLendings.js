import React from 'react';
import Loan from '../loan/Loan'
import helpers from '../../helpers/loan/api'
import './MyLoans.scss'
import FilterLoan from './FilterLoan'

class MyLendings extends React.Component {

	constructor(props) {
		super(props);
		this.loadPret = this.loadPret.bind(this);
    this.state = { lendingsActives: [] ,lendingsHistorized: [], displayActive : true };
    this.clickActive = this.clickActive.bind(this);
    this.clickInactive = this.clickInactive.bind(this);
	}

	componentDidMount() {
		this.loadPret();
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

	loadPret() {
    this.props.displaySpinner()
		helpers.getLendings().then((lendings) => {
      this.props.hideSpinner()
      const lendingsActives = lendings.filter(loan => (!(loan.dateCloture || loan.dateRefus)));
      const lendingsHistorized = lendings.filter(loan => (loan.dateCloture || loan.dateRefus));
			this.setState({
        lendingsActives: lendingsActives,
        lendingsHistorized: lendingsHistorized
			});
			// refresh loan : refresh notif
			this.props.onRefreshNotif();
		});
	}

	render() {
		const lendingsActive = this.state.lendingsActives.map(lending => {
			return <Loan
						key={lending.id}
						id={lending.id}
						loan={lending}
						reloadEmprunt={this.loadPret}
						onRefreshCount={this.props.onRefreshCount}
            userId={this.props.userId}
            displaySpinner={this.props.displaySpinner}
            hideSpinner={this.props.hideSpinner}
					/>
    });
    
    const lendingsHistorized= this.state.lendingsHistorized.map(lending => {
			return <Loan
						key={lending.id}
						id={lending.id}
						loan={lending}
						reloadEmprunt={this.loadPret}
						onRefreshCount={this.props.onRefreshCount}
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
            loanHistorized={lendingsHistorized}
            loansActives={lendingsActive}
            clickInactive={this.clickInactive}
            clickActive={this.clickActive}
          ></FilterLoan>
          {this.state.displayActive &&<div className="col d-flex flex-wrap justify-content-center">
            {lendingsActive.length == 0 && <span>Vous n'avez pas de prêts en cours.</span>}
            {lendingsActive.length > 0 && <div className="myloans-container">{lendingsActive}</div>}
          </div>}
          {!this.state.displayActive &&<div className="col d-flex flex-wrap justify-content-center">
            {lendingsHistorized.length == 0 && <span>Vous n'avez pas de prêts historiés.</span>}
            {lendingsHistorized.length > 0 && <div className="myloans-container">{lendingsHistorized}</div>}
          </div>}
			  </div>
      </section>
		)
	}

}

export default MyLendings
