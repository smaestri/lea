import React from 'react';
import Loan from './Loan'
import helpers from '../helpers/api'

class MyHistorizedLendings extends React.Component{

    constructor(props) {
        super(props);
        this.state = {lendings:[]};
    }

    componentDidMount(){
        helpers.getHistorizedLendings().then((lendings) => {
            this.setState({
                lendings: lendings
            });
        });
    }

    render(){
        console.log("render MyLendings")
        const lendings = this.state.lendings.map( lending => {
            return <Loan key={lending.id} id={lending.id} loan={lending} isLending={true} isHistory={true}/>
        });

        return(
            <div>
                <h1>My historized Lendings</h1>
                <ul>{lendings}</ul>
            </div>
        )
    }

}
