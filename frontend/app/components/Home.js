import React from 'react';
import SearchBar from './SearchBar';
import Notification from './Notification';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {LinkContainer} from 'react-router-bootstrap'
import helpers from '../helpers/api'
import {Link} from 'react-router'
import { withRouter } from 'react-router'

import '../../assets/css/home.scss';
import '../../assets/css/form.scss';

const {Component} = React;

class Home extends Component {

    constructor(props) {
        super(props);
        this.refreshCount = this.refreshCount.bind(this);
        this.refreshNotif = this.refreshNotif.bind(this);
        this.refreshName = this.refreshName.bind(this);
        this.state = {nbEmprunt: 0, nbPret: 0, requestedFriends: [], currentUser: ''};
        this.props.router.push('/home')
    }

    refreshCount() {
        helpers.countEmpruntAndPret().then((countBean) => {
            this.setState({
                nbEmprunt: countBean.nbEmprunt,
                nbPret: countBean.nbPret
            });
        });
    }

    refreshNotif() {
        helpers.getMyRequestedFriends().then((friends) => {
            this.setState({
                requestedFriends: friends
            });
        });
    }

    refreshName() {
        helpers.getAccount().then((user) => {
            this.setState({
                currentUser: user.fullName
            });
        });
    }

    componentDidMount() {
        this.refreshCount();
        this.refreshNotif();
        this.refreshName();
    }

    render() {
        const bienvenue = this.state.currentUser;

        return (
            <div id="main-content">
                <Navbar className="container-header">
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#/home">Livres entre amis</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <LinkContainer to={{pathname: '/my-books'}}>
                            <NavItem eventKey={1} href="#">Ma bibliothèque</NavItem>
                        </LinkContainer>
                        <LinkContainer to={{pathname: '/my-loans'}}>
                            <NavItem eventKey={1} href="#">Mes emprunts ({this.state.nbEmprunt})</NavItem>
                        </LinkContainer>
                        <LinkContainer to={{pathname: '/my-lendings'}}>
                            <NavItem eventKey={2} href="#">Mes prêts ({this.state.nbPret})</NavItem>
                        </LinkContainer>
                        <LinkContainer to={{pathname: '/my-friends'}}>
                            <NavItem eventKey={2} href="#">Mes amis</NavItem>
                        </LinkContainer>
                        <NavDropdown eventKey={3} title={bienvenue} id="basic-nav-dropdown">
                            <LinkContainer to={{pathname: '/historized-loans'}}>
                                <MenuItem eventKey={3.1}>Mes emprunts historiés</MenuItem>
                            </LinkContainer>
                            <LinkContainer to={{pathname: '/historized-lendings'}}>
                                <MenuItem eventKey={3.2}>Mes prêts historiés</MenuItem>
                            </LinkContainer>
                            <MenuItem divider/>
                            <LinkContainer to={{pathname: '/account'}}>
                                <MenuItem eventKey={3.3}>Mon compte</MenuItem>
                            </LinkContainer>
                            <MenuItem divider/>
                            <MenuItem href="logout">Me d&eacute;connecter
                            </MenuItem>
                        </NavDropdown>

                    </Nav>
                </Navbar>
                <Notification requestedFriends={this.state.requestedFriends} onRefreshNotification={this.refreshNotif}/>
                <SearchBar />
                {this.props.children && React.cloneElement(this.props.children, {
                    onRefreshCount: this.refreshCount,
                    onRefreshNotification: this.refreshNotif,
                    onRefreshName: this.refreshName
                })}
            </div>
        )
    }
}

export default withRouter(Home)
