import React from 'react'
import Rating from 'react-rating'
import helpers from '../helpers/api'
import '../../webapp/assets/css/rating.scss'

class Avis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {avis: {}};
    }

    // get auteur
    componentDidMount() {
        helpers.getUserDetail(this.props.avis.auteur).then((user) => {
            let avis = this.props.avis;
            avis.auteur = user.fullName;
            this.setState({avis: avis})
        });
    }

    render() {
        return (
            <div>
                <div>Ajouté le {this.state.avis.creationDate} par {this.state.avis.auteur} : </div>
                <div className="rating-container">
                    <Rating readonly={true} initialRate={this.state.avis.note}/>
                    <span>{this.state.avis.libelle}</span>
                </div>
            </div>)

    }
}

export default Avis
