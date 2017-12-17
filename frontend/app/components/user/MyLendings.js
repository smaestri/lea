import React from 'react';
import Loan from '../loan/Loan'
import helpers from '../../helpers/api'
import style from './MyLoans.scss'

class MyLendings extends React.Component {

	constructor(props) {
		super(props);
		this.loadPret = this.loadPret.bind(this);
		this.state = { lendings: [] };
	}

	componentDidMount() {
		this.loadPret();
		this.props.onRefreshCount();
	}

	loadPret() {
		helpers.getLendings().then((lendings) => {
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
						isLending="true"
						isHistory={false}
						reloadEmprunt={this.loadPret}
						onRefreshCount={this.props.onRefreshCount}
						userId={this.props.userId}
					/>
		});

		return (
			<div>
				<h1>Mes prêts</h1>
				{lendings.length == 0 && <span>Vous n'avez pas de prêts en cours.</span>}
				{lendings.length > 0 && <div className="myloans-container">{lendings}</div>}
			</div>
		)
	}

}

export default MyLendings
