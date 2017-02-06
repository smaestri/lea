import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import { withRouter } from 'react-router'
import { Link } from 'react-router'
import Rating from 'react-rating'
import helpers from '../helpers/api'
import '../../webapp/assets/css/book.scss'

class Book extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleLoan = this.handleLoan.bind(this);
        this.modifyBook = this.modifyBook.bind(this);
        this.state = {preteur:{}};
    }

    componentDidMount(){
        //Si recherche, recherche proprietaire
        if (!(this.props.previousPage == 'myBooks')){
            helpers.getUserDetail(this.props.book.userId).then((user) => {
                this.setState({preteur: user});
            })
        }

    }

    handleClick(e) {
        this.props.handleDelete(e, this.props.book.id);
    }

    modifyBook() {
        this.props.router.push('/edit-book/' + this.props.book.id )
    }

    handleLoan(event) {
        event.preventDefault();
        helpers.loanBook(this.props.book.id).then(() => {
            this.props.router.push('/my-loans')
        })
    }

    render() {
        //compute book note
        let sum = 0;
        this.props.book.avis.forEach((avis) => {
            sum = sum + avis.note;
        });
        let moyenne = sum / this.props.book.avis.length;
        return (
            <div className="book">
                <div className="titreBook">{this.props.book.titreBook}</div>
                {this.props.previousPage == 'listBook' && <div><label>Prêteur: </label><Link to={'user-detail/' + this.state.preteur.id }><span>{this.state.preteur.fullName}</span></Link></div>}
                <div className="imageBook"><img src={this.props.book.image} /></div>
                <div className="avisBook">
                    <div className="moyenneNote">Moyenne des avis ({this.props.book.avis.length} avis)</div>
                    <div className="ratingBook">
                        <Rating readonly={true} initialRate={moyenne} onClick={this.handleRating} />
                    </div>
                </div>
                <div className="linkBook"><Link to={'book-detail/' + this.props.book.id+ '/' + this.props.previousPage }>Voir les avis</Link></div>
                <div className="auteurBook"><label>Auteur: </label><span>{this.props.book.auteur}</span></div>
                <div className="descBook"><label>Description: </label>{this.props.book.description}</div>
                {(this.props.previousPage == 'myBooks') && <Button bsStyle="primary" bsSize="small" onClick={this.modifyBook}>Modifier</Button>}
                {(this.props.previousPage == 'myBooks') && <Button bsStyle="primary" bsSize="small" onClick={this.handleClick}>Supprimer</Button>}
                {(!(this.props.previousPage == 'myBooks') && this.props.book.statut =='FREE') && <Button bsStyle="primary" bsSize="small" onClick={this.handleLoan}>Emprunter</Button>}
                {(!(this.props.previousPage == 'myBooks') && this.props.book.statut !='FREE') && <span>Livre déjà emprunté</span>}
            </div>
        )
    }
}

export default withRouter(Book)
