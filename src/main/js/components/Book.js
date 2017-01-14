import React from 'react'
import helpers from '../helpers/api'
import { withRouter } from 'react-router';
import { Link } from 'react-router';

class Book extends React.Component {

    constructor(props) {
        super(props);
        this.handleLoan = this.handleLoan.bind(this);
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
            <li>{this.props.titreBook} -  <Link to={'book-detail/' + this.props.id }>Détails</Link>
                -  <a href="#" onClick={this.handleLoan}>Emprunter</a>
            </li>
        )
    }
}

export default withRouter(Book)
