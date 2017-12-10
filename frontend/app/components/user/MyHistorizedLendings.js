import React from 'react';
import Loan from '../loan/Loan'
import helpers from '../../helpers/api'
import style from './MyHistorizedLendings.scss'

class MyHistorizedLendings extends React.Component {

	constructor(props) {
		super(props);
		this.state = { lendings: [] };
	}

	componentDidMount() {
		helpers.getHistorizedLendings().then((lendings) => {
			this.setState({
				lendings: lendings
			});
		});
	}

	render() {
		const lendings = this.state.lendings.map(lending => {
			return <Loan
						key={lending.id}
						id={lending.id}
						loan={lending}
						isLending={true}
						isHistory={true}
						userId={this.props.userId}
					/>
		});

		return (
			<div className="container-hist-lendings">
				<h1>Mes prêts historiés</h1>
				{lendings.length == 0 && <span>Vous n'avez pas de prêts historiés.</span>}
				{lendings.length > 0 && <div className="loan-container">{lendings}</div>}
			</div>
		)
	}
}

export default MyHistorizedLendings
