import React from 'react'
import helpers from '../helpers/api'
import { withRouter } from 'react-router'
import { Link } from 'react-router'
import {Button} from 'react-bootstrap'
import '../../webapp/assets/css/book.scss'
import '../../webapp/assets/css/button.scss';

class Book extends React.Component {

    constructor(props) {
        super(props);
        this.handleLoan = this.handleLoan.bind(this);
        this.state = {disableEmpruntButton: false};
    }

    handleLoan(event) {
        this.setState({disableEmpruntButton: true});
        event.preventDefault();
        helpers.loanBook(this.props.id).then(() => {
            this.props.router.push('/my-loans')
        })
    }

    render() {
        return (
            <div className="book">
                <div className="titreBook">{this.props.book.titreBook}</div>
                <img src={this.props.book.image} />
                <div><Link to={'book-detail/' + this.props.book.id }>Voir les avis</Link></div>
                <Button bsStyle="primary" bsSize="small" onClick={this.handleLoan} disabled={this.state.disableEmpruntButton}>Emprunter</Button>
            </div>
        )
    }
}

export default withRouter(Book)
