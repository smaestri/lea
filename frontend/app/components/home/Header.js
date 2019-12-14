import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import 'core-js/features/array/from';
import { SVGInjector } from '@tanem/svg-injector';
import AOS from 'aos'
import $ from 'jquery'
import { mrDropdownGrid, mrCountdown, mrCountup, mrSticky, mrUtil } from '../../../js/mrare/index'


const { Component } = React;

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = { searchTerm: '' };
    this.logout = this.logout.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
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


    // we copy manually content from svg-injector.js see if better
    //  import 'core-js/features/array/from';
    // import { SVGInjector } from '@tanem/svg-injector';

    SVGInjector(document.querySelectorAll('[data-inject-svg]'), {
      afterEach(err, svg) {
        if (typeof jarallax === 'function') {
          svg.dispatchEvent(new CustomEvent('injected.mr.SVGInjector', { bubbles: true }));
        }
      },
    });




  }

  logout() {
    this.props.logout();
  }

  handleSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit() {
    let url = '/list-book-by-term/' + this.state.searchTerm;
    if (!this.state.searchTerm) {
      url = '/list-book/';
    }
    this.props.history.push(url)
  }

  render() {

    // redirect to login if logout triggered
    if (this.props.redirectToLogin && !(this.props.location.pathname === '/login')) {
      return <Redirect to='/login' />;
    }

    const menuGeneral = (
      <>
        <div className="navbar-container">
          <nav className="navbar navbar-expand-lg navbar-light" data-sticky="top">
            <div className="container">
              <a className="navbar-brand navbar-brand-dynamic-color fade-page" href="index.html">
                <img alt="Jumpstart" data-inject-svg src="dist/assets/img/logos/jumpstart.svg" />
              </a>
              <div className="d-flex align-items-center order-lg-3">
                <button aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-target=".navbar-collapse" data-toggle="collapse" type="button">
                  <img alt="Navbar Toggler Open Icon" className="navbar-toggler-open icon icon-sm" data-inject-svg src="dist/assets/img/icons/interface/icon-menu.svg" />
                  <img alt="Navbar Toggler Close Icon" className="navbar-toggler-close icon icon-sm" data-inject-svg src="dist/assets/img/icons/interface/icon-x.svg" />
                </button>
              </div>
              <div className="collapse navbar-collapse order-3 order-lg-2 ml-lg-3 justify-content-between">
                <form className="mt-3 mt-lg-0">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-white">
                        <img alt="Search" className="icon icon-xs bg-dark" data-inject-svg src="dist/assets/img/icons/interface/icon-search.svg" />
                      </span>
                    </div>
                    <input className="form-control" placeholder="Type your search" type="search" />
                  </div>
                </form>
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
                {this.props.isConnected &&
                  <div className="collapse navbar-collapse order-3 order-lg-2 justify-content-lg-end" id="navigation-menu">
                    <ul className="navbar-nav my-3 my-lg-0">
                      <li className="nav-item">
                        <div className="dropdown">
                          <a aria-expanded="false" aria-haspopup="true" className="dropdown-toggle nav-link nav-item arrow-bottom" data-toggle="dropdown-grid" href="#" role="button">Mon compte</a>
                          <div className="row dropdown-menu">
                            <div className="col-auto" data-dropdown-content>
                              <div className="dropdown-grid-menu">
                                {this.renderLink("Ma bibiliothèque", "/my-books")}
                                {this.renderLink("Mes amis", "/my-friends/")}
                                {this.renderLink("Mes emprunts historiés", "/historized-loans")}
                                {this.renderLink("Mes prêts historiés", "/historized-lendings")}
                                {this.renderLink("Mon compte", "/account")}
                                <span onClick={this.logout}>Me déconnecter</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                }
              </div>
            </div>
          </nav>
        </div>
        <div data-overlay className="bg-primary-3 jarallax text-white" data-jarallax data-speed="0.2">
        </div>
      </>
    )
    return (
      menuGeneral

      // <div className="navbar-container">
      //   <nav className="navbar navbar-expand-lg navbar-dark" data-overlay data-sticky="top">
      //     <div className="container">
      //       <a className="navbar-brand navbar-brand-dynamic-color fade-page" href="index.html">
      //         <img alt="Jumpstart" data-inject-svg src="dist/assets/img/logos/jumpstart.svg" />
      //       </a>
      //       <div className="d-flex align-items-center order-lg-3">
      //         <a href="#" className="btn btn-primary ml-lg-4 mr-3 mr-md-4 mr-lg-0 d-none d-sm-block order-lg-3">Purchase Now</a>
      //         <button aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-target=".navbar-collapse" data-toggle="collapse" type="button">
      //           <img alt="Navbar Toggler Open Icon" className="navbar-toggler-open icon icon-sm" data-inject-svg src="dist/assets/img/icons/interface/icon-menu.svg" />
      //           <img alt="Navbar Toggler Close Icon" className="navbar-toggler-close icon icon-sm" data-inject-svg src="dist/assets/img/icons/interface/icon-x.svg" />
      //         </button>
      //       </div>
      //       <div className="collapse navbar-collapse order-3 order-lg-2 justify-content-lg-end" id="navigation-menu">
      //         <ul className="navbar-nav my-3 my-lg-0">
      //           <li className="nav-item">
      //             <div className="dropdown">
      //               <a aria-expanded="false" aria-haspopup="true" className="dropdown-toggle nav-link nav-item arrow-bottom" data-toggle="dropdown-grid" href="#" role="button">Demos</a>
      //               <div className="row dropdown-menu">
      //                 <div className="col-auto" data-dropdown-content>
      //                   <div className="dropdown-grid-menu"><a href="index.html" className="dropdown-item fade-page">Overview</a><a href="landing-1.html" className="dropdown-item fade-page">Landing frfr1</a><a href="landing-2.html" className="dropdown-item fade-page">Landing 2</a><a href="landing-3.html" className="dropdown-item fade-page">Landing 3</a><a href="landing-4.html" className="dropdown-item fade-page">Landing 4</a><a href="landing-5.html" className="dropdown-item fade-page">Landing 5</a><a href="landing-6.html" className="dropdown-item fade-page">Landing 6</a>
      //                   </div>
      //                 </div>
      //               </div>
      //             </div>
      //           </li>
      //           <li className="nav-item">
      //             <div className="dropdown">
      //               <a aria-expanded="false" aria-haspopup="true" className="dropdown-toggle nav-link nav-item arrow-bottom" data-toggle="dropdown-grid" href="#" role="button">Pages</a>
      //               <div className="row dropdown-menu">
      //                 <div className="col-auto" data-dropdown-content>
      //                   <div className="dropdown-grid-menu">
      //                     <div className="dropdown">
      //                       <a aria-expanded="false" aria-haspopup="true" className="dropdown-item" data-toggle="dropdown-grid" href="#" role="button">Company</a>
      //                       <div className="row dropdown-menu">
      //                         <div className="col-auto" data-dropdown-content>
      //                           <div className="dropdown-grid-menu"><a href="company-about-1.html" className="dropdown-item fade-page">About 1</a><a href="company-about-2.html" className="dropdown-item fade-page">About 2</a>
      //                           </div>
      //                         </div>
      //                       </div>
      //                     </div>
      //                     <div className="dropdown">
      //                       <a aria-expanded="false" aria-haspopup="true" className="dropdown-item" data-toggle="dropdown-grid" href="#" role="button">Blog</a>
      //                       <div className="row dropdown-menu">
      //                         <div className="col-auto" data-dropdown-content>
      //                           <div className="dropdown-grid-menu"><a href="blog-listing-1.html" className="dropdown-item fade-page">Blog Listing 1</a><a href="blog-listing-2.html" className="dropdown-item fade-page">Blog Listing 2</a><a href="blog-listing-3.html" className="dropdown-item fade-page">Blog Listing 3</a>
      //                             <a href="blog-article.html" className="dropdown-item fade-page">Blog Article</a>
      //                           </div>
      //                         </div>
      //                       </div>
      //                     </div>
      //                     <div className="dropdown">
      //                       <a aria-expanded="false" aria-haspopup="true" className="dropdown-item" data-toggle="dropdown-grid" href="#" role="button">Help Center</a>
      //                       <div className="row dropdown-menu">
      //                         <div className="col-auto" data-dropdown-content>
      //                           <div className="dropdown-grid-menu"><a href="help-center-home.html" className="dropdown-item fade-page">Help Center Home</a><a href="help-center-category.html" className="dropdown-item fade-page">Help Center Category</a><a href="help-center-article.html" className="dropdown-item fade-page">Help Center Article</a>
      //                           </div>
      //                         </div>
      //                       </div>
      //                     </div>
      //                     <div className="dropdown">
      //                       <a aria-expanded="false" aria-haspopup="true" className="dropdown-item" data-toggle="dropdown-grid" href="#" role="button">Careers</a>
      //                       <div className="row dropdown-menu">
      //                         <div className="col-auto" data-dropdown-content>
      //                           <div className="dropdown-grid-menu"><a href="careers-1.html" className="dropdown-item fade-page">Careers 1</a><a href="careers-2.html" className="dropdown-item fade-page">Careers 2</a><a href="career-single.html" className="dropdown-item fade-page">Career Single</a>
      //                           </div>
      //                         </div>
      //                       </div>
      //                     </div>
      //                     <div className="dropdown">
      //                       <a aria-expanded="false" aria-haspopup="true" className="dropdown-item" data-toggle="dropdown-grid" href="#" role="button">Case Studies</a>
      //                       <div className="row dropdown-menu">
      //                         <div className="col-auto" data-dropdown-content>
      //                           <div className="dropdown-grid-menu"><a href="case-studies.html" className="dropdown-item fade-page">Case Studies</a><a href="case-study-single.html" className="dropdown-item fade-page">Case Study Single</a>
      //                           </div>
      //                         </div>
      //                       </div>
      //                     </div>
      //                     <div className="dropdown">
      //                       <a aria-expanded="false" aria-haspopup="true" className="dropdown-item" data-toggle="dropdown-grid" href="#" role="button">Pricing</a>
      //                       <div className="row dropdown-menu">
      //                         <div className="col-auto" data-dropdown-content>
      //                           <div className="dropdown-grid-menu"><a href="pricing-plans.html" className="dropdown-item fade-page">Pricing Plans</a><a href="pricing-table.html" className="dropdown-item fade-page">Pricing Table</a>
      //                           </div>
      //                         </div>
      //                       </div>
      //                     </div>
      //                     <div className="dropdown">
      //                       <a aria-expanded="false" aria-haspopup="true" className="dropdown-item" data-toggle="dropdown-grid" href="#" role="button">Contact</a>
      //                       <div className="row dropdown-menu">
      //                         <div className="col-auto" data-dropdown-content>
      //                           <div className="dropdown-grid-menu"><a href="contact.html" className="dropdown-item fade-page">Contact</a><a href="contact-map.html" className="dropdown-item fade-page">Contact Map</a><a href="contact-planner.html" className="dropdown-item fade-page">Contact Planner</a>
      //                           </div>
      //                         </div>
      //                       </div>
      //                     </div>
      //                     <div className="dropdown">
      //                       <a aria-expanded="false" aria-haspopup="true" className="dropdown-item" data-toggle="dropdown-grid" href="#" role="button">Account</a>
      //                       <div className="row dropdown-menu">
      //                         <div className="col-auto" data-dropdown-content>
      //                           <div className="dropdown-grid-menu"><a href="account-settings.html" className="dropdown-item fade-page">Account Settings</a><a href="account-invoice.html" className="dropdown-item fade-page">Invoice</a><a href="account-sign-up-cover.html" className="dropdown-item fade-page">Sign Up - Cover</a>
      //                             <a href="account-sign-in-cover.html" className="dropdown-item fade-page">Sign In - Cover</a><a href="account-sign-up-simple.html" className="dropdown-item fade-page">Sign Up - Simple</a><a href="account-sign-in-simple.html" className="dropdown-item fade-page">Sign In - Simple</a><a href="account-forgot-password.html" className="dropdown-item fade-page">Forgot Password</a>
      //                           </div>
      //                         </div>
      //                       </div>
      //                     </div>
      //                     <div className="dropdown">
      //                       <a aria-expanded="false" aria-haspopup="true" className="dropdown-item" data-toggle="dropdown-grid" href="#" role="button">Utility</a>
      //                       <div className="row dropdown-menu">
      //                         <div className="col-auto" data-dropdown-content>
      //                           <div className="dropdown-grid-menu"><a href="utility-coming-soon-subscribe.html" className="dropdown-item fade-page">Coming Soon Subscribe</a><a href="utility-coming-soon-countdown.html" className="dropdown-item fade-page">Coming Soon Countdown</a><a href="utility-coming-soon-social.html" className="dropdown-item fade-page">Coming Soon Social</a><a href="utility-legal-terms.html" className="dropdown-item fade-page">Legal Terms</a><a href="404.html" className="dropdown-item fade-page">404</a>
      //                           </div>
      //                         </div>
      //                       </div>
      //                     </div>
      //                   </div>
      //                 </div>
      //               </div>
      //             </div>
      //           </li>
      //           <li className="nav-item">
      //             <div className="dropdown">
      //               <a aria-expanded="false" aria-haspopup="true" className="dropdown-toggle nav-link nav-item arrow-bottom" data-toggle="dropdown-grid" href="#" role="button">Features</a>
      //               <div className="row dropdown-menu">
      //                 <div className="col-auto" data-dropdown-content>
      //                   <div className="dropdown-grid-menu"><a href="style-guide.html" className="dropdown-item fade-page">Style Guide</a><a href="plugins.html" className="dropdown-item fade-page">Plugins</a><a href="navigation-bars.html" className="dropdown-item fade-page">Navigation Bars</a>
      //                   </div>
      //                 </div>
      //               </div>
      //             </div>
      //           </li>
      //           <li className="nav-item">
      //             <div className="dropdown">
      //               <a aria-expanded="false" aria-haspopup="true" className="dropdown-toggle nav-link nav-item arrow-bottom" data-toggle="dropdown-grid" href="#" role="button">Support</a>
      //               <div className="row dropdown-menu">
      //                 <div className="col-auto" data-dropdown-content>
      //                   <div className="dropdown-grid-menu"><a href="documentation/index.html" className="dropdown-item" target="_blank">Documentation</a><a href="documentation/changelog.html" className="dropdown-item" target="_blank">Changelog</a><a href="https://mediumrare.ticksy.com/" className="dropdown-item" target="_blank">Get Help</a>
      //                   </div>
      //                 </div>
      //               </div>
      //             </div>
      //           </li>
      //         </ul>
      //       </div>
      //     </div>
      //   </nav>
      // </div>
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
