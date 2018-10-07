import React from 'react'
import { Button } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { Modal } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import helpers from '../../helpers/loan-actions/api'
import { loanStatus } from '../../helpers/utils'

class ButtonsEmprunt extends React.Component {

	constructor(props) {
		super(props);
		this.acceptLoan = this.acceptLoan.bind(this);
		this.refuseLoan = this.refuseLoan.bind(this);
		this.sendLoan = this.sendLoan.bind(this);
		this.closeLoan = this.closeLoan.bind(this);
		this.closeModalRefus = this.closeModalRefus.bind(this);
		this.showModalRefus = this.showModalRefus.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			motifRefus: '',
			disableAcceptButton: false,
			disableSendButton: false,
			disableCloseButton: false,
			showModal: false,
			redirectToHistorizedLendingd: false
		};
	}

	acceptLoan() {
		this.setState({ disableAcceptButton: true });
		helpers.acceptLoan(this.props.loan.id).then(() => {
			this.props.reloadEmprunt();
		});
	}

	refuseLoan() {
		if (this.state.motifRefus == '') {
			alert('Veuillez renseigner un motif de refus SVP.');
			return;
		}
		this.setState({ disableAcceptButton: true });
		helpers.refuseLoan(this.props.loan.id, this.state.motifRefus).then(() => {
			this.props.onRefreshCount();
			this.setState({ redirectToHistorizedLendingd: true });
		});
	}

	sendLoan() {
		this.setState({ disableSendButton: true });
		helpers.sendLoan(this.props.loan.id).then(() => {
			this.props.reloadEmprunt();
		});
	}

	closeLoan() {
		this.setState({ disableCloseButton: true });
		helpers.closeLoan(this.props.loan.id).then(() => {
			this.props.onRefreshCount();
			this.setState({ redirectToHistorizedLendingd: true });
		});
	}

	handleChange(event) {
		this.setState({ motifRefus: event.target.value });
	}

	closeModalRefus() {
		this.setState({ showModal: false });
	}

	showModalRefus() {
		this.setState({ showModal: true });
	}

	render() {

		if(this.state.redirectToHistorizedLendingd) {
			return <Redirect to='/historized-lendings'/>;
		}
		let displayAcceptButton, displayCloseButton, displaySendButton = false;
		const loan = this.props.loan;
		const userConnected = this.props.userId;

		if (!loan || !loan.livre) {
			return null;
		}
		//si statut = REQUESTED et je suis preteur => afficher bouton ******ACCEPTER****
		if (loan.actif && loan.livre.statut == loanStatus.REQUESTED && userConnected == loan.preteur.id) {
			displayAcceptButton = true;
		}

		// si statut = CURRENT et je suis emprunteur => afficher bouton ****RENVOYER***
		if (loan.actif && loan.livre.statut == loanStatus.CURRENT && userConnected == loan.emprunteur.id) {
			displaySendButton = true;
		}

		//Si statut = SENT et je suis preteur => afficher le proprietaire vous a renvoyé ce livr ele .... + CLORE
		if (loan.actif && loan.livre.statut == loanStatus.SENT && userConnected == loan.preteur.id) {
			displayCloseButton = true;
		}

		return (
			<div>
				{displayAcceptButton &&
					<Button bsStyle="primary" onClick={this.acceptLoan}
						disabled={this.state.disableAcceptButton}>Accepter</Button>}
				{displayAcceptButton && <Button bsStyle="primary"
					onClick={this.showModalRefus}>Refuser</Button>}
				{displaySendButton &&
					<Button bsStyle="primary" onClick={this.sendLoan}
						disabled={this.state.disableSendButton}>Renvoyer</Button>}
				{displayCloseButton &&
					<Button bsStyle="primary" onClick={this.closeLoan}
						disabled={this.state.disableCloseButton}>Clore</Button>}
				<Modal show={this.state.showModal} onHide={this.closeModalRefus}>
					<Modal.Header closeButton>
						<Modal.Title>Motif du refus</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<span>Veuillez indiquer un motif de refus:</span>
						<FormControl componentClass="textarea" placeholder="Motif du refus"
							onChange={this.handleChange} />
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.closeModalRefus} bsStyle="primary" >Close</Button>
						{displayAcceptButton &&
							<Button bsStyle="primary" onClick={this.refuseLoan}
								disabled={this.state.disableAcceptButton}>Valider</Button>}
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
}

export default withRouter(ButtonsEmprunt)
