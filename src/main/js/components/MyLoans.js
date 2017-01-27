import React from 'react';
import Loan from './Loan'
import helpers from '../helpers/api'

class MyLoans extends React.Component{

    constructor(props) {
        super(props);
        this.state = {loans:[]};
        this.loadEmprunt = this.loadEmprunt.bind(this);

    }

    loadEmprunt(){
        helpers.getLoans().then((loans) => {
            this.setState({
                loans: loans
            });
        });
    }

    componentDidMount(){
        this.loadEmprunt();
    }

    render(){
        const loans = this.state.loans.map( loan => {
            return <Loan key={loan.id} id={loan.id} loan={loan} isLending={false} reloadEmprunt={this.loadEmprunt}/>
        });

        return(
            <div>
                <h1>Mes emprunts</h1>
                <div className="loan-container">{loans}</div>
            </div>
        )
    }

}

export default MyLoans
