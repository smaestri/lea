import React from 'react';
import Loan from '../loan/Loan'
import helpers from '../../helpers/loan/api'
import { Button } from 'react-bootstrap'
import style from './MyLoans.scss'

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
			// refresh emprunt : refresh notif
			this.props.onRefreshNotif();
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
			<div>
				<h1>Mes emprunts</h1>
				{loans.length == 0 && <span>Vous n'avez pas d'emprunts en cours.</span>}
				{loans.length > 0 && <div className="myloans-container">{loans}</div>}
				<Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button>
			</div>
		)
	}
}

export default MyLoans
