import React from 'react'
import Rating from 'react-rating'
import helpers from '../helpers/api'
import formatDate from '../helpers/utils'
import {Link} from 'react-router'

class SVGIcon extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        let dateAvis = formatDate(this.state.avis.dateavis);
        return (
            <div>
                <div className="title-rating">
                    <div className="rating-title"><Link className="title-livre" to={'/book-detail/'}>{this.state.avis.livre}</Link></div>
                    <div className="rating-date">Ajouté le <span className="bolded">{dateAvis}</span> par <span className="bolded">{this.state.avis.auteur}</span> : </div>
                    <div className="rating-note">
                        <Rating empty={} readonly={true}
                                initialRate={this.state.avis.note}/>
                    </div>
                </div>
                <blockquote>{this.state.avis.libelle}</blockquote>
            </div>)

    }
}

export default SVGIcon
