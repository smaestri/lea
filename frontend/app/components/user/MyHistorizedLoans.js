import React from 'react';
import Loan from '../loan/Loan'
import helpers from '../../helpers/loan/api'

class MyhistorizedLoans extends React.Component {

	constructor(props) {
		super(props);
		this.state = { loans: [] };
	}

	componentDidMount() {
		helpers.getHistorizedLoans().then((loans) => {
			this.setState({
				loans: loans
			});
		});
	}

	render() {
		const loans = this.state.loans.map(loan => {
			return <Loan
						key={loan.id}
						id={loan.id}
						loan={loan}
						isLending={false}
						isHistory={true}
						userId={this.props.userId}
					/>
		});

		return (
			<div className="historized-container">
				<h1>Mes emprunts historiés</h1>
				{loans.length == 0 && <span>Vous n'avez pas d'emprunts historiés.</span>}
				{loans.length > 0 && <div className="loan-container">{loans}</div>}
			</div>
		)
	}

}

export default MyhistorizedLoans
