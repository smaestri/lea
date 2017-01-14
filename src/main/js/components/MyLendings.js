import React from 'react';
import Loan from './Loan'
import helpers from '../helpers/api'

class MyLendings extends React.Component{

    constructor(props) {
        super(props);
        this.state = {lendings:[]};
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

    render(){
        console.log("render MyLendings")
        const lendings = this.state.lendings.map( lending => {
            return <Loan key={lending.id} id={lending.id} loan={lending} isLending={true}/>
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
