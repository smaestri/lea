import React from 'react'
import SearchBar from './SearchBar'
import Notification from './Notification'
import Footer from './Footer'
import helpers from '../helpers/api'
import {Link} from 'react-router'
import { withRouter } from 'react-router'

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
            <div>
                <header id="header"  className="container">

                    <div id="header-inner"  className="sixteen columns over">

                        <div id="masthead"  className="one-third column alpha">
                            <h1 id="site-title"  className="remove-bottom">
                                <a href="index.html"><img src="assets/img/logo.png" /></a></h1>
                        </div>

                        <div className="container-search">
                            <div className="top-header">
                                <div className="content-search">
                                    <SearchBar />
                                </div>
                                <div className="menu-user">
                                    <div className="dropdown">
                                        <span>Bienvenue, {bienvenue}</span>
                                        <div className="dropdown-content">
                                            <ul>
                                                <li>
                                                    <Link to={'/historized-loans/'} >
                                                        Mes emprunts historiés
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={'/historized-lendings/'}>
                                                        Mes prêts historiés
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={'/account/'}>
                                                        Mon compte
                                                    </Link>
                                                </li>
                                                <li>
                                                    <a href="logout">
                                                        Me déconnecter
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="top-menu">
                                <nav id="main-nav"  className="two-thirds column omega">
                                    <a href="#main-nav-menu"  className="mobile-menu-button button">+ Menu</a>
                                    <ul id="main-nav-menu"  className="nav-menu">
                                        <li id="nav-home"  className="current" >
                                            <Link to={'/home/'} activeClassName="current">
                                               Accueil
                                            </Link>
                                        </li>
                                        <li id="nav-bib">
                                            <Link to={'/my-books/'} activeClassName="current">
                                                Ma bibliothèque
                                            </Link>
                                        </li>
                                        <li id="nav-emprunt" >
                                            <Link to={'/my-loans/'} activeClassName="current">
                                                Mes emprunts ({this.state.nbEmprunt})
                                            </Link>
                                        </li>
                                        <li id="nav-portfolio" >
                                            <Link to={'/my-lendings/'} activeClassName="current">
                                                Mes prêts ({this.state.nbPret})
                                            </Link>
                                        </li>
                                        <li id="nav-amis" >
                                            <Link to={'/my-friends/'} activeClassName="current">
                                                Mes amis
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>

                </header>


                <Notification requestedFriends={this.state.requestedFriends} onRefreshNotification={this.refreshNotif}/>
                {this.props.children && React.cloneElement(this.props.children, {
                    onRefreshCount: this.refreshCount,
                    onRefreshNotification: this.refreshNotif,
                    onRefreshName: this.refreshName
                })}
                <Footer></Footer>

            </div>
        )
    }
}

export default withRouter(Home)
