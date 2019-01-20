import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.scss'

class Footer extends React.Component {

	render() {
		return (
			<footer>
				<div>
					&copy; Livres entre amis, 2017
				</div>
				<div>
					<Link to={"/camarche"}>Comment ça marche?</Link> |
					<Link to={"/contact"}>Contact</Link> |
					<Link to={"/faq"}>FAQ</Link> |
					<Link to={"/infos"}>Informations légales</Link>
				</div>
			</footer>
		)
	}
}

export default Footer
