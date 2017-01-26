import React from 'react'
import Rating from 'react-rating'
import helpers from '../helpers/api'

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
        return (<div>
            <span>Ajouté le {this.state.avis.creationDate} par {this.state.avis.auteur} </span>
            <Rating readonly={true} initialRate={this.state.avis.note}/>
            <span>{this.state.avis.libelle}</span>
        </div>)

    }
}

export default Avis
