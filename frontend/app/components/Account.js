import React from 'react'
import {FormGroup} from 'react-bootstrap'
import {Col} from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'
import {Button} from 'react-bootstrap'
import {Form} from 'react-bootstrap'
import {ControlLabel} from 'react-bootstrap'
import {withRouter} from 'react-router'
import helpers from '../helpers/api'

class Account extends React.Component {

    constructor(props) {
        super(props);
        this.state = {user: {firstName: '', lastName: '', password: '', confirmpassword: ''}}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        helpers.getAccount(this.props.params.bookId).then((user) => {
            this.setState({user: user});
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.state.user.password != this.state.user.confirmPassword){
            alert('les password ne correspondent pas');
            return;
        }
        helpers.saveEditUser(this.state.user).then(() => {
            this.props.onRefreshName();
            this.props.router.push('/');
        });
    }

    handleChange(event) {
        const user = this.state.user;
        user[event.target.name] = event.target.value;
        this.setState({user: user});
    }

    getValidationState() {
      if(this.state.user.password != this.state.user.confirmPassword){
          return 'error';
      }
    }

    render() {
        return (
         <div className="container">
             <div className="account-container">
                 <h2>Veuillez indiquer vos informations</h2>
                 <Form horizontal onSubmit={this.handleSubmit}>
                     <FormGroup controlId="formHorizontalEmail">
                         <Col componentClass={ControlLabel} sm={2}>Prénom:</Col>
                         <Col sm={10}>
                             <FormControl type="text" name="firstName" value={this.state.user.firstName} onChange={this.handleChange}/>
                         </Col>
                     </FormGroup>
                     <FormGroup>
                         <Col componentClass={ControlLabel} sm={2}>Nom:</Col>
                         <Col sm={10}>
                             <FormControl type="text" name="lastName" value={this.state.user.lastName} onChange={this.handleChange}/>
                         </Col>
                     </FormGroup>
                     <FormGroup validationState={this.getValidationState()}>
                         <Col componentClass={ControlLabel} sm={2}>Password:</Col>
                         <Col sm={10}>
                             <FormControl type="password" name="password" value={this.state.user.password} onChange={this.handleChange}/>
                         </Col>
                     </FormGroup>
                     <FormGroup validationState={this.getValidationState()}>
                         <Col componentClass={ControlLabel} sm={2}>Confirm password:</Col>
                         <Col sm={10}>
                             <FormControl type="password" name="confirmPassword" value={this.state.user.confirmPassword} onChange={this.handleChange}/>
                         </Col>
                     </FormGroup>
                     <Button bsStyle="primary" onClick= {() => this.props.router.push('/')}>Retour</Button>
                     <Button type="submit" value="Submit" bsStyle="primary">Valider</Button>
                 </Form>
             </div>
         </div>
        )
    }
}

export default withRouter(Account)
