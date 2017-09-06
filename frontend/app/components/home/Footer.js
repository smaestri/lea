import React from 'react'

class Footer extends React.Component {

	render() {
		return (
			<footer id="colophon">
				<div id="footer-base">
					<div className="container">
						<div className="eight columns">
							&copy; Livres entre amis, 2017
						</div>
						<div className="eight columns far-edge">
							<a href="/camarche">Comment ça marche?</a> | <a
							href="/contact">Contact</a> | <a href="/faq">FAQ</a> | <a href="/info">Informations
							légales</a>
						</div>
					</div>
				</div>
			</footer>
		)
	}
}

export default Footer
