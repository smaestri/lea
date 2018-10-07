import React from 'react'
import { Link } from 'react-router-dom'
import helpers from '../../helpers/book/api'
import style from './ListCategories.scss'

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
			return <div key={cat.id}><Link to={'/list-book/' + cat.id}>{cat.name}</Link></div>
		});

		return (
			<div className="container-categorie">
				<h3>A la recherche d'un livre?</h3>
				<p>Cliquez sur une catégorie ci-dessous pour faire apparaitre les livres!</p>
				{categories}
			</div>
		);
	}
}

export default ListCategories
