import React from 'react'
import Rating from 'react-rating'
import helpers from '../../helpers/user/api'
import './Avis.scss'

class Avis extends React.Component {

	static defaultProps = {
		displayImage: true
	  }

	constructor(props) {
		super(props);
		this.state = { avis: {} };
	}

	componentDidMount() {
		helpers.getUserInfo(this.props.avis.auteur).then((user) => {
			let avis = this.props.avis;
			avis.auteur = user.fullName;
			this.setState({ avis: avis })
		});
	}

	render() {
		return (
        <div className="m-2">
          <div className="media rounded align-items-center pl-3 pr-3 pr-md-4 py-2 shadow-sm bg-white">
          <img src="/webjars/assets/img/user.png" className="avatar avatar-sm flex-shrink-0 mr-3" />
            <div className="container-avis">
              <div className="text-dark mb-0">{this.state.avis.libelle}</div>
              {<div class="text-dark mb-0">
                {<Rating
                    readonly={true}
                    initialRating={this.state.avis.note}/>}
              </div>}
              <div className="text-dark mb-0"><b><i>Livre: {this.state.avis.titrebook}</i></b></div>
            </div>
          </div>
        </div>
      )

	}
}

export default Avis
