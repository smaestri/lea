import React from 'react'
import helpers from '../../helpers/user/api'
import { Link, Redirect } from 'react-router-dom'

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
      <div data-overlay className="min-vh-100 bg-light d-flex flex-column justify-content-md-center">
        <section className="py-3">
          <div className="container">
            {error}
            <div className="row justify-content-center">
              <div className="col-xl-4 col-lg-5 col-md-6">
                <div className="card card-body shadow">
                  <h1 className="h5 text-center">Sign In</h1>
                  <form onSubmit={this.submit}>
                    <div className="form-group">
                      <input type="email" className="form-control" name="login" placeholder="Email Address" onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                      <input type="password" className="form-control" name="password" placeholder="Password" onChange={this.handleChange} />
                      <div className="text-right text-small mt-2">
                        <a href="/users/resetPwd">Forgot Password?</a>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="custom-control custom-checkbox text-small">
                        <input type="checkbox" className="custom-control-input" id="sign-in-remember" />
                        <label className="custom-control-label" htmlFor="sign-in-remember">Remember me next time</label>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-block" type="submit">Sign In</button>
                  </form>
                </div>
                <div className="text-center text-small mt-3">
                  Don't have an account? <Link to='/subscribe'>Sign up here</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
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
