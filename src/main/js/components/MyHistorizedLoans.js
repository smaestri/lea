import React from 'react';
import Loan from './Loan'
import helpers from '../helpers/api'

class MyhistorizedLoans extends React.Component{

    constructor(props) {
        super(props);
        this.state = {loans:[]};
    }

    componentDidMount(){
        helpers.getHistorizedLoans().then((loans) => {
            this.setState({
                loans: loans
            });
        });
    }

    render(){
        console.log("render MyLoans")
        const loans = this.state.loans.map( loan => {
            return <Loan key={loan.id} id={loan.id} loan={loan} isLending={false} isHistory={true}/>
        });

        return(
            <div>
                <h1>My historized Loans</h1>
                <div className="loan-container">{loans}</div>
            </div>
        )
    }

}

export default MyhistorizedLoans
