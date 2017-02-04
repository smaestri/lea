import React from 'react'
import { withRouter } from 'react-router'
import helpers from '../helpers/api'
import Avis from './Avis.js'
import {Button} from 'react-bootstrap'
import '../../webapp/assets/css/book-detail.scss'

class BookDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {book:{ avis: []}};
        this.handleLoan = this.handleLoan.bind(this);
    }

    componentDidMount(){
        let book= helpers.getBook(this.props.params.bookId);
        if(book){
            this.setState({book:book })
        }
    }

    handleLoan(event) {
        event.preventDefault();
        helpers.loanBook(this.state.book.id).then(() => {
            this.props.router.push('/my-loans')
        })
    }

    render() {
        const avis = this.state.book.avis.map( avis => {
            return <Avis key={avis.id} id={avis.id} avis={avis}/>
        });

        let displayEmprunter = false;
        const userConnected = document.getElementById("userId").value;
        if(userConnected != this.state.book.userId &&  this.state.book.statut == 'FREE'){
            displayEmprunter = true;
        }

        return (
            <div className="book-detail-content">
                <div className="book-information">
                    <div><h1>{this.state.book.titreBook}</h1></div>
                    <span>{this.state.book.description}</span>
                    <span>{this.state.book.statut}</span>
                    {displayEmprunter && <Button bsStyle="primary" bsSize="small" onClick={this.handleLoan}>Emprunter</Button>}
                </div>
                <div className="book-rating">
                    <h1>Avis</h1>
                    {avis}
                </div>

            </div>
        )
    }
}

export default withRouter(BookDetail)
