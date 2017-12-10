import React from 'react';
import Loan from '../loan/Loan'
import helpers from '../../helpers/api'

class MyLoans extends React.Component {

	constructor(props) {
		super(props);
		this.state = { loans: [] };
		this.loadEmprunt = this.loadEmprunt.bind(this);
	}

	loadEmprunt() {
		helpers.getLoans().then((loans) => {
			this.setState({
				loans: loans
			});
		});
	}

	componentDidMount() {
		this.loadEmprunt();
		this.props.onRefreshCount();
	}

	render() {
		const loans = this.state.loans.map(loan => {
			return <Loan
						key={loan.id}
						id={loan.id}
						loan={loan}
						isLending={false}
						isHistory={false}
						onRefreshCount={this.props.onRefreshCount}
						reloadEmprunt={this.loadEmprunt}
						userId={this.props.userId}
					/>
		});

		return (
			<div className="container-loan">
				<h1>Mes emprunts</h1>
				{loans.length == 0 && <span>Vous n'avez pas d'emprunts en cours.</span>}
				{loans.length > 0 && <div className="loan-container">{loans}</div>}
			</div>
		)
	}
}

export default MyLoans
