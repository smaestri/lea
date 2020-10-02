import React from 'react'
import { withRouter } from 'react-router'
import helpers from '../../helpers/book/api'
import Avis from './Avis.js'
import { Button } from 'react-bootstrap'
import { renderHTML} from '../../helpers/utils'

import './BookDetail.scss'

class BookDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			 book: { avis: [] }
		};
	}

	componentDidMount() {
    this.props.displaySpinner();
		helpers.getBook(this.props.match.params.bookId).then ( book => {
        this.props.hideSpinner();
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
			<section>
				<div className="container">
					<div className="row justify-content-center text-center">
            <div className="col-md-9 col-lg-8 col-xl-7">
              <h3>Avis du livre <i>{renderHTML(this.state.book.titreBook)}</i></h3>
            </div>
			  	</div>
          <div className="row justify-content-center">
            <div className="book-avis">
              <div className="image-container">
                <div className="image-content">
                  <img className="img" src={this.state.book.image} />
                </div>
              </div>
              {avis.length > 0 && <div className="rating-container">{avis}</div>}
              {avis.length == 0 && <span>Pas d'avis pour ce livre actuellement.</span>}
            </div>
          </div>
          <Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button>
        </div>
				
			</section>
		)
	}
}

export default withRouter(BookDetail)
