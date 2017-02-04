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
import { Link } from 'react-router';

import '../../webapp/assets/css/home.scss';

const {Component} = React;

class Home extends Component{

    constructor(props) {
        super(props);
        this.refreshCount = this.refreshCount.bind(this);
        this.refreshNotif = this.refreshNotif.bind(this);
        this.state = {nbEmprunt:0, nbPret: 0, requestedFriends: []};
    }


    refreshCount(){
        helpers.countEmpruntAndPret().then((countBean) => {
            this.setState({
                nbEmprunt: countBean.nbEmprunt,
                nbPret: countBean.nbPret
            });
        });
    }

    refreshNotif(){
        helpers.getMyRequestedFriends().then((friends) => {
            this.setState({
                requestedFriends: friends
            });
        });
    }


    componentDidMount(){
        this.refreshCount();
        this.refreshNotif()
    }



  render(){
      const bienvenue =  document.getElementById("userName").value;

    return(
      <div id="main-content">
          <Navbar>
              <Navbar.Header>
                  <Navbar.Brand>
                      <a href="#">Livres entre amis</a>
                  </Navbar.Brand>
              </Navbar.Header>
              <Nav>
                  <LinkContainer to={{ pathname: '/my-books' }}>
                      <NavItem eventKey={1} href="#">Ma bibliothèque</NavItem>
                  </LinkContainer>
                  <LinkContainer to={{ pathname: '/my-loans' }}>
                    <NavItem eventKey={1} href="#">Mes emprunts ({this.state.nbEmprunt})</NavItem>
                  </LinkContainer>
                  <LinkContainer to={{ pathname: '/my-lendings' }}>
                    <NavItem eventKey={2} href="#">Mes prêts ({this.state.nbPret})</NavItem>
                  </LinkContainer>
                  <LinkContainer to={{ pathname: '/my-friends' }}>
                      <NavItem eventKey={2} href="#">Mes amis</NavItem>
                  </LinkContainer>
                  <NavDropdown eventKey={3} title={bienvenue} id="basic-nav-dropdown">
                      <LinkContainer to={{ pathname: '/historized-loans' }}>
                        <MenuItem eventKey={3.1}>Mes emprunts historiés</MenuItem>
                      </LinkContainer>
                      <LinkContainer to={{ pathname: '/historized-lendings' }}>
                        <MenuItem eventKey={3.2}>Mes prêts historiés</MenuItem>
                      </LinkContainer>
                      <MenuItem divider />
                      <LinkContainer to={{ pathname: '/account' }}>
                        <MenuItem eventKey={3.3}>Mon compte</MenuItem>
                      </LinkContainer>
                      <MenuItem divider />
                      <MenuItem href="logout">Me d&eacute;connecter
                      </MenuItem>
                  </NavDropdown>

              </Nav>
          </Navbar>
        <Notification requestedFriends={this.state.requestedFriends} />
        <SearchBar />
          {this.props.children && React.cloneElement(this.props.children, {
              onRefreshCount: this.refreshCount,
              onRefreshNotification: this.refreshNotif
          })}
      </div>
    )
  }
}

export default Home
