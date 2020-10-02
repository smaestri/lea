import React from 'react'
import {  FormGroup, FormControl, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import {loadSvg} from '../../helpers/utils'
import { Redirect } from 'react-router-dom'
import helpers from '../../helpers/user/api'
import { Modal } from 'react-bootstrap'
import './Account.scss'

class Account extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '', firstName: '', lastName: '', password: '', confirmpassword: '', condition: false, disableSubmit: false
      },
      redirectToHome: false,
      showModal: false,
      errors: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleCondition = this.toggleCondition.bind(this);
    this.closeModalTerms = this.closeModalTerms.bind(this);
		this.showModalTerms = this.showModalTerms.bind(this);
  }

  componentDidMount() {
    if (!this.props.isCreation) {
      this.props.displaySpinner()
      helpers.getAccount(this.props.match.params.bookId).then((user) => {
        this.props.hideSpinner();
        this.setState({ user: { ...user, password: '', confirmPassword: '' } });
      })
    }
    loadSvg();
  }

	closeModalTerms() {
		this.setState({ showModal: false });
  }
  
  showModalTerms() {
    event.preventDefault();
		this.setState({ showModal: true });
	}

  handleSubmit(event) {
    event.preventDefault()
    if(!this.state.user || !this.state.user.condition) {
      alert("Merci d'accepter les conditions générales")
      return false;
    }
    this.setState({ disableSubmit: true });
    this.props.displaySpinner()
    helpers.updateOrCreateUser(this.props.isCreation, this.state.user).then(() => {
      this.setState({ redirectToHome: true });
      this.props.hideSpinner();
      this.props.refreshUserConnected();
    }, (response) => {
      this.setState({ disableSubmit: false });
      this.props.hideSpinner();
      if (response.response.data && response.response.data.errors && response.response.data.errors.length > 0) {
        this.setState({ errors: response.response.data.errors });
        window.scrollTo(0, 0);
      }
    })
  }

  handleChange(event) {
    const user = this.state.user;
    user[event.target.name] = event.target.value;
    this.setState(user);
  }

  toggleCondition() {
    const user = this.state.user;
    user.condition = !this.state.user.condition;
    this.setState(user);
  }

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to='/' />;
    }
    let errors = [];
    if (this.state.errors) {
      errors = this.state.errors.map(err => {
        return <div className="error" key={err.field + err.code}>{err.defaultMessage}</div>
      });
    }

    return (
      <>
        <section>
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-xl-4 col-lg-5 col-md-6 mb-5 mb-md-0">
                {errors && errors.length > 0 && <div className="error-container">{errors}</div>}
                <div class="card card-body shadow">
                  <h1 class="h5 text-center">Créer compte</h1>
                  <Form horizontal onSubmit={this.handleSubmit} >
                    <FormGroup>
                      <label for="email">Email : </label>
                      <input type="email" disabled={this.props.isCreation?false:true} class="form-control" name="email" value={this.state.user.email} onChange={this.handleChange} placeholder="Email Address" />
                    </FormGroup>
                    <FormGroup>
                      <label for="password">Password : </label>
                      <input type="password" class="form-control" name="password" onChange={this.handleChange} placeholder="Password" />
                      <small>Password must be at least 8 characters</small>
                    </FormGroup>
                    <FormGroup>
                      <label for="confirmPassword">Confirmer password : </label>
                      <input type="password" class="form-control" name="confirmPassword" onChange={this.handleChange} placeholder="Confirm Password" />
                    </FormGroup>
                    <FormGroup>
                      <label for="firstName">Prénom : </label>
                      <FormControl type="text" name="firstName" value={this.state.user.firstName} onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                      <label for="lastName">Nom : </label>
                      <FormControl type="text" name="lastName" value={this.state.user.lastName} onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                      <div class="custom-control custom-checkbox text-small">
                        <input type="checkbox" class="custom-control-input" id="sign-up-agree" onChange={this.toggleCondition} />
                        <label class="custom-control-label" for="sign-up-agree">Je suis d'accord avec les <a href="#" onClick={this.showModalTerms}>conditions générales</a>
                        </label>
                      </div>
                      </FormGroup>
                      <button class="btn btn-primary btn-block" type="submit">Créer compte</button>
                  </Form>
                </div>
                <div class="text-center text-small mt-3">
                  Vous avez déjà un compte? <Link to="/login">Connectez-vous</Link>
                </div>
                <div class="text-center text-small mt-3">
                  <Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button>
                </div>
              </div>
              
            </div>
            
          </div>
         
        </section>
        
        <a href="#top" class="btn btn-primary rounded-circle btn-back-to-top" data-smooth-scroll data-aos="fade-up" data-aos-offset="2000" data-aos-mirror="true" data-aos-once="false">
          <img src="assets/img/icons/interface/icon-arrow-up.svg" alt="Icon" class="icon bg-white" data-inject-svg />
        </a>
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

export default withRouter(Account)
