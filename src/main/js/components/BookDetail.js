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
        this.returnToBooks = this.returnToBooks.bind(this);
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

    returnToBooks() {
        if(this.props.params.previousPage == 'myBooks'){
            this.props.router.push('/my-books')
        }
        else if (this.props.params.previousPage == 'listBooks'){
            this.props.router.push('/list-books')
        }
        else{ //user-detail
            this.props.router.push('/user-detail/' + this.state.book.userId + '/bookDetail');
        }
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
            <div className="main-content">
                <div className="book-information">
                    <div><h1>Avis du livre <i>{this.state.book.titreBook}</i></h1></div>
                    {displayEmprunter && <Button bsStyle="primary" bsSize="small" onClick={this.handleLoan}>Emprunter</Button>}
                </div>
                <div className="book-rating">
                    {avis.length == 0 && <span>Pas d'avis pour ce livre actuellement.</span>}
                    {avis.length >0 && <div className="book-container">{avis}</div>}
                </div>
                <Button bsStyle="primary" onClick={this.returnToBooks}>Retour</Button>
            </div>
        )
    }
}

export default withRouter(BookDetail)
