import React from 'react'
import { Col, FormGroup, FormControl, Button, Form, ButtonToolbar } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import helpers from '../../helpers/user/api'
import style from './Account.scss'

class Account extends React.Component {

	constructor(props) {
		super(props);
		this.state = { user: { firstName: '', lastName: '', password: '', confirmpassword: '' } }
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		helpers.getAccount(this.props.match.params.bookId).then((user) => {
			this.setState(Object.assign({}, user, {password: ''}, {confirmPassword: ''}));
		})
	}

	handleSubmit(event) {
		event.preventDefault();
		if (this.password != this.confirmPassword) {
			alert('les password ne correspondent pas');
			return;
		}
		helpers.saveEditUser(this.state).then((response) => {
			this.props.onRefreshName();
			if(response == 'firstNameLength'){
				alert('Le prénom doit faire plus de deux caractères SVP.')
				return
			}

			if(response == 'lastNameLength'){
				alert('Le nom doit faire plus de deux caractères SVP.')
				return
			}
			if(response == 'passwordLength'){
				alert('Le mot de passe doit faire plus de six caractères SVP.')
				return
			}
			if(response == 'passwordNotMatch'){
				alert('Les mots de passe ne correspondent pas.')
				return
			}
			alert('Modifications apportés avec succès')
		});
	}

	handleChange(event) {
		const user = this.state;
		user[event.target.name] = event.target.value;
		this.setState(Object.assign({}, user));
	}

	render() {
		return (
			<div className="container-account">
				<h2>Veuillez indiquer vos informations</h2>
				<div className="form-content">
					<Form horizontal onSubmit={this.handleSubmit}>
						<FormGroup>
							<Col for="firstName" sm={4}>Email : </Col>
							<Col sm={8}>
								<span>{this.state.email}</span>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col for="firstName" sm={4}>Prénom : </Col>
							<Col sm={8}>
								<FormControl type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col for="lastName" sm={4}>Nom : </Col>
							<Col sm={8}>
								<FormControl type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col for="password" sm={4}>Mot de passe : </Col>
							<Col sm={8}>
								<FormControl type="password" name="password" value={this.state.password} onChange={this.handleChange} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col for="confirmPassword" sm={4}>Confirmer mot de passe : </Col>
							<Col sm={8}>
								<FormControl type="password" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} />
							</Col>
						</FormGroup>
						<ButtonToolbar className="text-center">
							<Button type="submit" value="Valider" bsStyle="primary">Valider</Button>
						</ButtonToolbar>
					</Form>
				</div>
				<Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button>
			</div>
		)
	}
}

export default withRouter(Account)
