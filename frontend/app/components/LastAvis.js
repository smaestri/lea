import React from 'react'
import helpers from '../helpers/api'

class LastAvis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {avis: []};
    }

    componentDidMount(){
        helpers.getLastAvis().then((avis) => {
            this.setState({
                avis: avis
            });
        });
    }

    render() {
        const avis = this.state.avis.map( avis => {
            return <li>{avis.libelle}</li>
        });


        return(
        <div className="main-content">
            <ul>{avis}</ul>
        </div>);
    }
}

export default LastAvis
