import React from 'react'
import { withRouter } from 'react-router'
import helpers from '../../helpers/book/api'
import Avis from './Avis.js'
import { Button } from 'react-bootstrap'
import { renderHTML} from '../../helpers/utils'
import style from './BookDetail.scss'

class BookDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			 book: { avis: [] }
		};
	}

	componentDidMount() {
		helpers.getBook(this.props.match.params.bookId).then ( book => {
				this.setState({ book })
		})
	}

	render() {
		let avis="";
		if(this.state.book && this.state.book.avis) {
			avis = this.state.book.avis.map(avis => {
				return <Avis key={avis.id} id={avis.id} avis={avis} displayImage={false}/>		
			});

		}

		return (
			<div className="book-detail-container">
				<div className="book-title">
					<div><h1>Avis du livre <i>{renderHTML(this.state.book.titreBook)}</i></h1></div>
				</div>
				<div className="book-avis">
					<div className="image-container">
						<div className="image-content">
							<img className="img" src={this.state.book.image} />
						</div>
					</div>
					{avis.length > 0 && <div className="rating-container">{avis}</div>}
					{avis.length == 0 && <span>Pas d'avis pour ce livre actuellement.</span>}
				</div>
				
				
				<Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button>
			</div>
		)
	}
}

export default withRouter(BookDetail)
