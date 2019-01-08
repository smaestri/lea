import React from 'react'
import { withRouter } from 'react-router'
import ButtonsEmprunt from './ButtonsEmprunt'
import LoanAttributes from './LoanAttributes'
import { renderHTML} from '../../helpers/utils'
import style from './Loan.scss'

class Loan extends React.Component {

	render() {
		const userConnected = this.props.userId;
		let livremodel = {};
		if(this.props.loan.livreModel) {
			livremodel =this.props.loan.livreModel;
		} else {
			return null;
		}
		
		let avis = livremodel.avis.find( avisBook => {
				let dateFin = this.props.loan.dateCloture;
				if(this.props.loan.dateRefus){
					dateFin = this.props.loan.dateRefus;
				}
				return (this.props.loan.emprunteurId == avisBook.auteur && avisBook.dateavis >= this.props.loan.dateDemande &&
					 (dateFin == undefined || avisBook.dateavis <= dateFin))
		});

		return (
			<div className="loan-container">
				<div className="loan-header">{renderHTML(livremodel.titreBook)}</div>
				<div className="loan-content">
					<div className="image-container">
						<div className="image-content">
							<img className="img" src={livremodel.image}/>
						</div>
					</div>
					<div className="loan-main">
						<div className="loan-buttons">
							{!this.props.isHistory &&
							<ButtonsEmprunt
								loan={this.props.loan}
								reloadEmprunt={this.props.reloadEmprunt}
								onRefreshCount={this.props.onRefreshCount}
								userId={this.props.userId}
							/>}
						</div>
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
				</div>
			</div>
		)
	}
}

export default withRouter(Loan)
