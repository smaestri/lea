import React from 'react'
import Button from 'react-bootstrap/lib/Button';
import { withRouter } from 'react-router';
import '../../webapp/assets/css/book.scss';
import { Link } from 'react-router';

class MyBook extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.modifyBook = this.modifyBook.bind(this);
    }

    handleClick(e) {
        this.props.handleDelete(e, this.props.book.id);
    }

    modifyBook() {
        this.props.router.push('/edit-book/' + this.props.book.id )
    }

    render() {
        return (
            <div className="book">
                <div className="titreBook">{this.props.book.titreBook}</div>
                <img src={this.props.book.image} />
                <div><Link to={'book-detail/' + this.props.book.id }>Voir les avis</Link></div>
                <Button bsStyle="primary" bsSize="small" onClick={this.modifyBook}>Modifier</Button>
                <Button bsStyle="primary" bsSize="small" onClick={this.handleClick}>Supprimer</Button>
            </div>
        )
    }
}

export default withRouter(MyBook)
