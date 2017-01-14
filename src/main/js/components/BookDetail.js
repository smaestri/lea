import React from 'react'
import helpers from '../helpers/api'

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
                <h1>Avis</h1>
                {avis}
            </div>
        )
    }
}

export default BookDetail
