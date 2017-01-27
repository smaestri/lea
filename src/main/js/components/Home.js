import React from 'react';
import SearchBar from './SearchBar';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {LinkContainer} from 'react-router-bootstrap'

import '../../webapp/assets/css/home.scss';

const {Component} = React;

class Home extends Component{

  render(){
      const props = this.props;
      const {store} = props;

      const bienvenue =  document.getElementById("userName").value;
      const nbEmprunts = document.getElementById('nbEmprunts').value;
      const nbPrets = document.getElementById('nbPrets').value;
      const nbrequestedFriends = document.getElementById('requestedFriends').value;

      let requestFriend="";
      if(nbrequestedFriends && nbrequestedFriends > 0){
          requestFriend =   <LinkContainer to={{ pathname: '/my-requested-friends' }}>
              <NavItem eventKey={1} href="#">Nouvelle demande d'amis!</NavItem>
          </LinkContainer>
      }

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
                    <NavItem eventKey={1} href="#">Mes emprunts ({nbEmprunts})</NavItem>
                  </LinkContainer>
                  <LinkContainer to={{ pathname: '/my-lendings' }}>
                    <NavItem eventKey={2} href="#">Mes prêts ({nbPrets})</NavItem>
                  </LinkContainer>
                  <LinkContainer to={{ pathname: '/my-friends' }}>
                      <NavItem eventKey={2} href="#">Mes amis</NavItem>
                  </LinkContainer>
                  {requestFriend}
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
        <SearchBar store={store}  />
        {this.props.children}
      </div>
    )
  }
}

export default Home
