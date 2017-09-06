import React from 'react'
import { withRouter } from 'react-router'
import ButtonsEmprunt from './ButtonsEmprunt'
import LoanAttributes from './LoanAttributes'

class Loan extends React.Component {

	render() {
		const userConnected = this.props.userId;
		// get avis posted for this book and this user
		let avis = this.props.loan.livre.avis.find( avisBook => {
				return (userConnected == avisBook.auteur)
		});

		return (
			<div className="loan container">
				<div className="loan-image">
					<img src={this.props.loan.livre.image}/>
				</div>
				<div className="loan-main">
					<div className="loan-header">{this.props.loan.livre.titreBook}</div>
					<div className="loan-details">
						<LoanAttributes
						 	loan={this.props.loan}
							isHistory={this.props.isHistory}
							isLending={this.props.isLending}
							userId={userConnected}
							reloadEmprunt={this.props.reloadEmprunt}
							avis={avis}
						/>
					</div>
				</div>
				<div className="loan-buttons">
					{!this.props.isHistory &&
					<ButtonsEmprunt
					   loan={this.props.loan}
						 reloadEmprunt={this.props.reloadEmprunt}
					   onRefreshCount={this.props.onRefreshCount}
						 userId={this.props.userId}
					 />}
				</div>
			</div>
		)
	}
}

export default withRouter(Loan)
