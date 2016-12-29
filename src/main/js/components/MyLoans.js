import React from 'react';
import Loan from './Loan'
import helpers from '../helpers/api'

class MyLoans extends React.Component{

    constructor(props) {
        super(props);
        this.state = {loans:[]};
        this.sendLoan = this.sendLoan.bind(this);

    }

    sendLoan(idLoan){
        helpers.sendLoan(idLoan).then(() => {
            this.componentDidMount();
        });
    }

    componentDidMount(){
        console.log('MyLoans did mount')
        helpers.getLoans().then((loans) => {
            console.log('loans')
            console.log(loans)
            this.setState({
                loans: loans
            });
        });
    }

    render(){
        console.log("render MyLoans")
        const loans = this.state.loans.map( loan => {
            return <Loan key={loan.id} id={loan.id} loan={loan}  sendLoan={this.sendLoan}/>
        });

        return(
            <div>
                <h1>My Loans</h1>
                <ul>{loans}</ul>
            </div>
        )
    }

}

export default MyLoans
