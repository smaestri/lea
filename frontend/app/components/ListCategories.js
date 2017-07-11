import React from 'react'
import helpers from '../helpers/api'
import { Link } from 'react-router'

class ListCategories extends React.Component {

	constructor(props) {
		super(props);
		this.state = { categories: [] };
	}

	componentDidMount() {
		helpers.getCategories().then((avis) => {
			this.setState({
				categories: avis
			});
		});
	}

	render() {
		const categories = this.state.categories.map(cat => {
			return <div><Link className="excerpt-link" to={'/list-book'}>{cat.name}</Link></div>
		});

		return (
			<div className="four columns">
				<h3>A la recherche d'un livre?</h3>
				<p>Cliquez sur une catégorie ci-dessous pour faire apparaitre les livres!</p>
				{categories}
			</div>
		);
	}
}

export default ListCategories
