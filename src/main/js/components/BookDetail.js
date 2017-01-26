import React from 'react'
import helpers from '../helpers/api'
import Avis from './Avis.js'

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
            <div>
                <h1>{this.state.book.titreBook}</h1>
                <span>{this.state.book.description}</span>
                <h1>Avis</h1>
                {avis}
            </div>
        )
    }
}

export default BookDetail
