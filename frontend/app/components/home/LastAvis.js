import React from 'react'
import helpers from '../../helpers/api'
import Avis from '../book/Avis.js'
import style from './LastAvis.scss'

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
		const avis = this.state.avis.map(avis => {
			return <Avis key={avis.id} id={avis.id} avis={avis}/>
		});

		return (
			<div className='container-last-avis'>
				<h3>Les derniers avis</h3>
				{avis}
			</div>
		);
	}
}

export default LastAvis