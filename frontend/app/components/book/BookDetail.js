import React from 'react'
import { withRouter } from 'react-router'
import helpers from '../../helpers/api'
import Avis from './Avis.js'
import { Button } from 'react-bootstrap'

class BookDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = { book: { avis: [] } };
		this.returnToBooks = this.returnToBooks.bind(this);
	}

	componentDidMount() {
		let book = helpers.getBook(this.props.params.bookId).then ( book => {
				this.setState({ book })
		})
	}

	returnToBooks() {
		if (this.props.params.previousPage == 'myBooks') {
			this.props.router.push('/my-books')
		}
		else if (this.props.params.previousPage == 'listBook') {
			this.props.router.push('/list-book')
		}
		else if (this.props.params.previousPage == 'home') {
			this.props.router.push('/')
		}
		else {
			this.props.router.push('/user-detail/' + this.state.book.userId + '/userDetail');
		}
	}

	render() {
		const avis = this.state.book.avis.map(avis => {
			return <Avis key={avis.id} id={avis.id} avis={avis}/>
		});

		return (
			<div className="container">
				<div className="book-information">
					<div><h1>Avis du livre <i>{this.state.book.titreBook}</i></h1></div>
				</div>
				<div className="book-rating">
					{avis.length == 0 && <span>Pas d'avis pour ce livre actuellement.</span>}
					{avis.length > 0 && <div className="rating-container">{avis}</div>}
				</div>
				<Button bsStyle="primary" onClick={this.returnToBooks}>Retour</Button>
			</div>
		)
	}
}

export default withRouter(BookDetail)
