import React from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'

class Footer extends React.Component {

  constructor(props) {
    super(props)
    this.showModalTerms = this.showModalTerms.bind(this);
    this.closeModalTerms = this.closeModalTerms.bind(this);
    this.state = {  showModal: false}
  }

  showModalTerms() {
    event.preventDefault();
		this.setState({ showModal: true });
  }
  
  closeModalTerms() {
		this.setState({ showModal: false });
  }

	render() {
		return (
      <>
			<footer>
				<div>
					&copy; Livres entre amis, 2017
				</div>
				<div>
					<Link to={"/camarche"}>Comment ça marche?</Link> |
					{/* <Link to={"/contact"}>Contact</Link> | */}
					{/* <Link to={"/faq"}>FAQ</Link> | */}
					<Link onClick={this.showModalTerms}>Informations légales</Link>
				</div>
			</footer>
              <Modal show={this.state.showModal} onHide={this.closeModalTerms}>
              <Modal.Header closeButton>
                <Modal.Title>Conditions générales</Modal.Title>
              </Modal.Header>
              <Modal.Body>
          Livres entre amis est un site Internet qui met en relation des particuliers afin qu'il s'échangent des livres.
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeModalTerms} bsStyle="primary" >Close</Button>
              </Modal.Footer>
            </Modal>
            </>
		)
	}
}

export default Footer
