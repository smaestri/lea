import React from 'react'
import helpers from '../../helpers/book/api'
import Avis from '../book/Avis.js'

class LastAvis extends React.Component {

	constructor(props) {
		super(props);
		this.state = { avis: [] };
	}

	componentDidMount() {
		helpers.getLastAvis().then((avis) => {
			this.setState({
				avis
			});
		});
	}

	render() {
		if(!this.state.avis || this.state.avis.length == 0 ) {
			return null;
		}
		const avis = this.state.avis.map(avis => {
			return <Avis key={avis.id} id={avis.id} avis={avis}  />
		});

		return (
    
      <section class="bg-primary text-white">
        <div class="container">
          <div class="row section-title justify-content-center text-center">
            <div class="col-md-9 col-lg-8 col-xl-7">
              <h3 class="display-4">Les derniers avis</h3>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col d-flex flex-wrap justify-content-center">
            {avis}
            </div>
          </div>
        </div>
      </section>
		);
	}
}

export default LastAvis
