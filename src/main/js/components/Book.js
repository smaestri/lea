import React from 'react'
import helpers from '../helpers/api'
import { withRouter } from 'react-router';


class Book extends React.Component {

    constructor(props) {
        super(props);
        this.handleDetails = this.handleDetails.bind(this);
        this.handleLoan = this.handleLoan.bind(this);
    }

    handleDetails(event) {
        event.preventDefault();
        console.log('DETAIL BOOK')
        console.log(event)

        helpers.getBookDetail(this.props.id).then(() => {
            console.log("display popin")
            //TODO : display popin
        })
    }

    handleLoan(event) {
        event.preventDefault();
        console.log('LOAN BOOK')
        console.log(event)

        helpers.loanBook(this.props.id).then(() => {
            this.props.router.push('/my-loans')
        })
    }

    render() {
        return (
            <li>{this.props.titreBook} - <a href="#" onClick={this.handleDetails}>Détail</a>
                -  <a href="#" onClick={this.handleLoan}>Emprunter</a>
            </li>
        )
    }
}

export default withRouter(Book)
