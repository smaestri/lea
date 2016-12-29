import React from 'react';
import Loan from './Loan'
import helpers from '../helpers/api'

class MyLendings extends React.Component{

    constructor(props) {
        super(props);
        this.state = {lendings:[]};
        this.acceptLoan = this.acceptLoan.bind(this);
        this.closeLoan = this.closeLoan.bind(this);
    }

    componentDidMount(){
        console.log('MyLendings did mount')
        helpers.getLendings().then((lendings) => {
            console.log('lendings')
            console.log(lendings)
            this.setState({
                lendings: lendings
            });
        });
    }

    acceptLoan(idLoan){
        helpers.acceptLoan(idLoan).then(() => {
            this.componentDidMount();
        });
    }

    closeLoan(idLoan){
        helpers.closeLoan(idLoan).then(() => {
            this.componentDidMount();
        });
    }

    render(){
        console.log("render MyLendings")
        const lendings = this.state.lendings.map( lending => {
            return <Loan key={lending.id} id={lending.id} loan={lending} acceptLoan={this.acceptLoan} closeLoan={this.closeLoan} />
        });

        return(
            <div>
                <h1>My Lendings</h1>
                <ul>{lendings}</ul>
            </div>
        )
    }

}

export default MyLendings
