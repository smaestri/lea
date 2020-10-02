import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import 'core-js/features/array/from';
import helpersBook from '../../helpers/book/api'
import {loadSvg} from '../../helpers/utils'
import AOS from 'aos'
import { mrDropdownGrid, mrCountdown, mrCountup, mrSticky, mrUtil } from '../../../assets/js/index'


const { Component } = React;

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = { searchTerm: '', 	categories: null, };
    this.logout = this.logout.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.redirectToListBook = this.redirectToListBook.bind(this);
  }

  componentDidMount() {
    this.props.displaySpinner()
    helpersBook.getCategories().then((categories) => {
      this.props.hideSpinner();
			this.setState({ categories, categorySelected:'' });
		});
  }

  componentDidUpdate() {
    if (mrDropdownGrid) {
      mrDropdownGrid.init();
    }
    AOS.init({ once: true });
    //todo : background images
    //todo countdown, countup
    //new mrCountdown();
    //new mrCountup();
    if (mrSticky) {
      mrSticky.init();
    }

    loadSvg();
  }

  logout() {
    this.props.logout();
  }

  handleSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit() {
    event.preventDefault();
    let url = '/list-book-by-term/' + this.state.searchTerm;
    if (!this.state.searchTerm) {
      url = '/list-book/';
    }
    this.props.history.push(url)
  }

  redirectToListBook(categorySelected) {
    this.setState({categorySelected})
    this.props.history.push('/list-book-by-category/' + categorySelected)
  }

  render() {
    // redirect to login if logout triggered
    if (this.props.redirectToLogin && !(this.props.location.pathname === '/login')) {
      return <Redirect to='/login' />;
    }
    const catReact = this.state.categories && this.state.categories.map(category => {
      let active = '';
      if(this.state.categorySelected == category.id){
        active = 'active';
      }

			return <Link className={`dropdown-item ${active}`} onClick={() => this.redirectToListBook(category.id)}/* to={{pathname: '/list-book-by-category/' + category.id, state: {categorie: cat.name}}}*/>{category.name}</Link>
      // <a className="dropdown-item" href="style-guide.html" target="_blank">Style Guide</a><a class="dropdown-item" href="plugins.html" target="_blank">Plugins</a><a class="dropdown-item" href="navigation-bars.html" target="_blank">Navigation Bars</a>
		});
    const menuGeneral = (
      <>
        <div className="navbar-container">
          <nav className="navbar navbar-expand-lg navbar-light" data-sticky="top">
            <div className="container">
              <Link className="navbar-brand navbar-brand-dynamic-color fade-page" to="/">
                <img alt="logo" src="/webjars/assets/img/logo.png" />
              </Link>
              <div className="d-flex align-items-center order-lg-3">
                <button aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-target=".navbar-collapse" data-toggle="collapse" type="button">
                  <img alt="Navbar Toggler Open Icon" className="navbar-toggler-open icon icon-sm" data-inject-svg src="/webjars/assets/img/icons/interface/icon-menu.svg" />
                  <img alt="Navbar Toggler Close Icon" className="navbar-toggler-close icon icon-sm" data-inject-svg src="/webjars/assets/img/icons/interface/icon-x.svg" />
                </button>
              </div>
              <div className="collapse navbar-collapse order-3 order-lg-2 ml-lg-3 justify-content-between">
                <form className="mt-3 mt-lg-0" onSubmit={this.handleSubmit}>
                  <div className="input-group">
                    <div className="input-group-prepend"  onClick={this.handleSubmit} >
                      <span className="input-group-text bg-white">
                        <img alt="Search"className="icon icon-xs bg-dark" data-inject-svg src="/webjars/assets/img/icons/interface/icon-search.svg" />
                      </span>
                    </div>
                    <input className="form-control" placeholder="Recherchez livre, isbn, etc." type="search" onChange={this.handleSearchChange} />
                  </div>
                </form>
                <div className="dropdown">
                  <button aria-expanded="false" aria-haspopup="true" className="btn btn-sm btn-primary dropdown-toggle arrow-bottom" data-toggle="dropdown" type="button">
                    Catégorie
                  </button>
                  <div className="dropdown-menu">
                    <Link to='/list-book/' key="allcat" className="dropdown-item">Toutes</Link>
                      {catReact}
                  </div>
                </div>
                {this.props.isConnected && <ul className="navbar-nav my-3 my-lg-0">
                  <li className="nav-item">
                    {this.renderLink("Mes emprunts ", "/my-loans")}
                  </li>
                  <li className="nav-item">
                    {this.renderLink("Mes prêts", "/my-lendings")}
                  </li>
                </ul>
                }
                {!this.props.isConnected && <ul className="navbar-nav my-3 my-lg-0">
                  <li className="nav-item">
                    {this.renderLink("Se connecter", "/login")}
                  </li>
                  <li className="nav-item">
                    {this.renderLink("S'inscrire", "/subscribe")}
                  </li>
                </ul>}
              </div>
              { this.props.isConnected && <div className="collapse navbar-collapse order-3 order-lg-2 justify-content-lg-end" id="navigation-menu">
                    <ul className="navbar-nav my-3 my-lg-0">
                      <li className="nav-item">
                        <div className="dropdown">
                          <a aria-expanded="false" aria-haspopup="true" className="dropdown-toggle nav-link nav-item arrow-bottom" data-toggle="dropdown-grid" href="#" role="button">Bienvenue, {this.props.currentUser}</a>
                          <div className="row dropdown-menu">
                            <div className="col-auto" data-dropdown-content>
                              <div className="dropdown-grid-menu">
                                {this.renderLink("Ma bibiliothèque", "/my-books")}
                                {this.renderLink("Mes amis", "/my-friends/")}
                                {this.renderLink("Mon compte", "/account")}
                                <a className="nav-link" href="#" onClick={this.logout}><i>Me déconnecter</i></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div> }
                  {this.props.notifications}
            </div>
          </nav>
        </div>
        <div data-overlay className="bg-primary-3 jarallax text-white" data-jarallax data-speed="0.2">
        </div>
        
      </>
    )
    return (
      menuGeneral
    )
  }



  renderLink(lib, link) {
    //close menu
    if (mrDropdownGrid) {
      mrDropdownGrid.clearMenus();
    }


    return <Link to={link} className="nav-link">{lib}</Link>
  }
}

export default withRouter(Header)
