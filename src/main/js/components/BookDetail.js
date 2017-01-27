import React from 'react'
import helpers from '../helpers/api'
import Avis from './Avis.js'
import '../../webapp/assets/css/book-detail.scss'

class BookDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {book:{ avis: []}};
    }

    componentDidMount(){
        let book= helpers.getBook(this.props.params.bookId);
        if(book){
            this.setState({book:book })
        }
    }

    render() {
        const avis = this.state.book.avis.map( avis => {
            return <Avis key={avis.id} id={avis.id} avis={avis}/>
        });

        return (
            <div className="book-detail-content">
                <div className="book-information">
                    <div><h1>{this.state.book.titreBook}</h1></div>
                    <span>{this.state.book.description}</span>
                </div>
                <div className="book-rating">
                    <h1>Avis</h1>
                    {avis}
                </div>

            </div>
        )
    }
}

export default BookDetail
