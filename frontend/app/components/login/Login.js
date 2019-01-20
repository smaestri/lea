import React from 'react'
import { Col, FormGroup, FormControl, Button, Form,  ButtonToolbar } from 'react-bootstrap'
import helpers from '../../helpers/user/api'
import { Link, Redirect } from 'react-router-dom'
import './Login.scss'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.state = {
            redirectToHome: false,
            error: false,
            credentials: {
                login: '',
                password: ''
            }
        };
    }

    render() {

        let error = "";
        if (this.state.redirectToHome) {
            return <Redirect to='/' />;
        }

        if (this.state.error) {
            error = <div className="error">Login ou mot de passe incorrect</div>
        }

        return (
            <div>
                <div className="container-connexion">
                    <div className="login-container">
                        <h2>Veuillez indiquer vos informations de connexion</h2>
                        {error}

                        <Form horizontal onSubmit={this.submit}>
                            <FormGroup>
                                <Col sm={2}>Login</Col>
                                <Col sm={10}><FormControl type="text" name="login" onChange={this.handleChange}></FormControl></Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2}>Password</Col>
                                <Col sm={10}><FormControl type="password" name="password" onChange={this.handleChange}></FormControl></Col>
                            </FormGroup>
                            <ButtonToolbar className="text-center">
                                <Button type="submit" value="Valider" bsStyle="primary">Valider</Button>
                                <div><a href="/users/resetPwd">J'ai oublié mon mot de passe</a></div>
                                <Link to='/subscribe'><Button id="linksignup"  bsStyle="primary" bsSize="small">Inscrivez-vous!</Button></Link>
                            </ButtonToolbar>
                        </Form>
                    </div>
                </div>
                <div className="retour"><Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button></div>
            </div>

        );
    }

    handleChange(event) {
		const credentials = this.state.credentials;
		credentials[event.target.name] = event.target.value;
		this.setState(credentials);
	}

    submit(e) {
        //needed to prevent form default submit behavior
        e.preventDefault();
        helpers.login(this.state.credentials.login, this.state.credentials.password).then(response => {
            this.setState({ redirectToHome: true, error: false });
            this.props.refreshUserConnected();
        },
            () => {
                this.setState({ error: true });
            })
    }
}

export default Login
