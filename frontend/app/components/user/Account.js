import React from 'react'
import { Col, FormGroup, FormControl, Button, Form, ButtonToolbar } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router-dom'
import helpers from '../../helpers/user/api'
import style from './Account.scss'

class Account extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			user: {
				email: '', firstName: '', lastName: '', password: '', confirmpassword: ''
			},
			redirectToHome: false,
			errors: []
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		if(!this.props.isCreation) {
			helpers.getAccount(this.props.match.params.bookId).then((user) => {
				this.setState( { user : {...user, password: '', confirmPassword: ''}});
			})
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		helpers.updateOrCreateUser(this.props.isCreation, this.state.user).then(() => {
			this.setState({ redirectToHome: true });
			this.props.refreshUserConnected();
		}, (response) => {
			if(response.data && response.data.errors && response.data.errors.length > 0) {
				this.setState({errors: response.data.errors});
				window.scrollTo(0, 0);
			}
		});
	}

	handleChange(event) {
		const user = this.state.user;
		user[event.target.name] = event.target.value;
		this.setState(user);
	}

	render() {

		if (this.state.redirectToHome) {
            return <Redirect to='/' />;
		}
		let emailField = <span>{this.state.user.email}</span>;
		if(this.props.isCreation) {
			emailField =  <FormControl type="text" name="email" value={this.state.user.email} onChange={this.handleChange} />
		}
		let errors = [];
		if (this.state.errors) {
			errors = this.state.errors.map(err => {
				return <div className="error" key={err.field+err.code}>{err.defaultMessage}</div>
			});
		}

		return (
			<div className="container-account">
				<h2>Veuillez indiquer vos informations</h2>
				{errors && errors.length > 0 && <div className="error-container">{errors}</div>}
				<div className="form-content">
					<Form horizontal onSubmit={this.handleSubmit}>
						<FormGroup>
							<Col sm={4}>Email : </Col>
							<Col sm={8}>
								{emailField}
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={4}>Prénom : </Col>
							<Col sm={8}>
								<FormControl type="text" name="firstName" value={this.state.user.firstName} onChange={this.handleChange} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={4}>Nom : </Col>
							<Col sm={8}>
								<FormControl type="text" name="lastName" value={this.state.user.lastName} onChange={this.handleChange} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={4}>Mot de passe : </Col>
							<Col sm={8}>
								<FormControl type="password" name="password" value={this.state.user.password} onChange={this.handleChange} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col sm={4}>Confirmer mot de passe : </Col>
							<Col sm={8}>
								<FormControl type="password" name="confirmPassword" value={this.state.user.confirmPassword} onChange={this.handleChange} />
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
