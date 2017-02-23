import React from 'react'
import helpers from '../helpers/api'
import Avis from './Avis.js'

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
            return <Avis key={avis.id} id={avis.id} avis={avis}/>
        });


        return(
            <div className="height columns">
                <h3>Les derniers avis</h3>
                {avis}
            </div>
        );
    }
}

export default LastAvis
