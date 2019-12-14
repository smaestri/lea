import React from 'react'
import { Link } from 'react-router-dom'
import helpers from '../../helpers/book/api'

class ListCategories extends React.Component {

	constructor(props) {
		super(props);
		this.state = { categories: [] };
	}

	componentDidMount() {
		
		helpers.getCategories().then((cat) => {
			const allCat = [{ id:0, name: 'Tous les livres' }, ...cat]
			this.setState({
				categories: allCat
			});
		});
	}

	render() {
		const categories = this.state.categories.map(cat => {
			return <div key={cat.id}><Link to={{pathname: '/list-book-by-category/' + cat.id, state: {categorie: cat.name}}}>{cat.name}</Link></div>
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
