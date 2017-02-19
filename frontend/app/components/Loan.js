import React from 'react'
import { withRouter } from 'react-router'
import ButtonsEmprunt from './ButtonsEmprunt'
import LoanAttributes from './LoanAttributes'

import '../../assets/css/loans.scss'
import '../../assets/css/button.scss'

class Loan extends React.Component {

    render() {
        return (
            <div className="loan">
                <div className="loan-image">
                    <img src={this.props.loan.livre.image} />
                </div>
                <div className="loan-main">
                    <div className="loan-header">{this.props.loan.livre.titreBook}</div>
                    <div className="loan-details">
                        <LoanAttributes loan={this.props.loan} isHistory={this.props.isHistory} isLending={this.props.isLending} displayLinks={true} />
                    </div>
                </div>
                <div className="loan-buttons">
                    {!this.props.isHistory && <ButtonsEmprunt loan={this.props.loan} reloadEmprunt={this.props.reloadEmprunt} onRefreshCount={this.props.onRefreshCount}  />}
                </div>
            </div>
        )
    }
}

export default withRouter(Loan)
