import React from 'react'
import { Col, FormGroup, FormControl, Button, Form, ButtonToolbar } from 'react-bootstrap'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router-dom'
import helpers from '../../helpers/user/api'

class Account extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '', firstName: '', lastName: '', password: '', confirmpassword: '', disableSubmit: false
      },
      redirectToHome: false,
      errors: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.isCreation) {
      helpers.getAccount(this.props.match.params.bookId).then((user) => {
        this.setState({ user: { ...user, password: '', confirmPassword: '' } });
      })
    }
  }

  handleSubmit(event) {
    this.setState({ disableSubmit: true });
    event.preventDefault();
    helpers.updateOrCreateUser(this.props.isCreation, this.state.user).then(() => {
      this.setState({ redirectToHome: true });
      this.props.refreshUserConnected();
    }, (response) => {
      this.setState({ disableSubmit: false });
      if (response.data && response.data.errors && response.data.errors.length > 0) {
        this.setState({ errors: response.data.errors });
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
    if (this.props.isCreation) {
      emailField = <FormControl type="text" name="email" value={this.state.user.email} onChange={this.handleChange} />
    }
    let errors = [];
    if (this.state.errors) {
      errors = this.state.errors.map(err => {
        return <div className="error" key={err.field + err.code}>{err.defaultMessage}</div>
      });
    }

    return (
      <div data-overlay class="min-vh-100 bg-light d-flex flex-column justify-content-md-center o-hidden">
        <section class="py-3">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-xl-4 col-lg-5 col-md-6 mb-5 mb-md-0">
                <div class="card card-body shadow">
                  <h1 class="h5 text-center">Create Account</h1>
                  <Form horizontal onSubmit={this.handleSubmit}>
                    <FormGroup>
                      <Col sm={3}>Email : </Col>
                      <Col sm={9}>
                        {emailField}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3}>Prénom : </Col>
                      <Col sm={9}>
                        <FormControl type="text" name="firstName" value={this.state.user.firstName} onChange={this.handleChange} />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3}>Nom : </Col>
                      <Col sm={9}>
                        <FormControl type="text" name="lastName" value={this.state.user.lastName} onChange={this.handleChange} />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3}>Mot de passe : </Col>
                      <Col sm={9}>
                        <FormControl type="password" name="password" value={this.state.user.password} onChange={this.handleChange} />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3}>Confirmer mot de passe : </Col>
                      <Col sm={9}>
                        <FormControl type="password" name="confirmPassword" value={this.state.user.confirmPassword} onChange={this.handleChange} />
                      </Col>
                    </FormGroup>
                    <ButtonToolbar className="text-center">
                      <Button type="submit" value="Valider" bsStyle="primary" disabled={this.state.disableSubmit}>Valider</Button>
                    </ButtonToolbar>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button>
      </div>
    )
  }
}

export default withRouter(Account)
