import React from 'react'
import LastAvis from './LastAvis'
import ListCategories from './ListCategories'
import Rating from 'react-rating'

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = { avis: [] };
  }
  
	render() {
		return (
      <>
      <section>
        <div className='container'>
          <div className='row section-title justify-content-center text-center'>
            <div className='col-md-9 col-lg-8 col-xl-7'>
             <h3 className="display-4">Livres entre amis<br /><mark><span data-typed-text data-loop="true" data-type-speed="90" data-strings='["Echanger vos livres plutot que les acheter!","Pourquoi acheter un livre neuf si quelqu &apos;un le possède et peut vous le prêter?","Cultivez-vous gratuitement","Rencontrez des amateurs de livres comme vous","Evaluez vos livres"]'></span></mark></h3>
              {/* <h2>Bienvenue sur Livres entre amis, partagez vos livres ... entre	amis!</h2> */}
              <div className="lead">Pourquoi achetez neuf des livres que d'autres personnes possèdent surement? Ce site vous permet d'échanger gratuitement des livres avec d'autres personnes. </div>
            </div>
          </div>
          <div className="row align-items-center justify-content-around">
            <div className="col-md-9 col-lg-5 aos-init aos-animate" data-aos="fade-in">
              <img src="/webjars/assets/img/square-2.jpg" alt="Image" className="img-fluid rounded shadow" />
              <img src="/webjars/assets/img/square-1.jpg" alt="Image" className="position-absolute p-0 col-4 col-xl-5 border border-white border-thick rounded-circle top left shadow-lg mt-5 ml-n5 ml-lg-n3 ml-xl-n5 d-none d-md-block" data-jarallax-element="-20 0" style={{ zIndex: 0, transform: "translate3d(0px, -1.31033px, 0px)" }} />
            </div>
            <div className="col-md-9 col-lg-6 col-xl-5 mt-4 mt-md-5 mt-lg-0">
              <ol className="list-unstyled p-0">
                <li className="d-flex align-items-start my-4 my-md-5">
                  <div className="rounded-circle p-3 p-sm-4 d-flex align-items-center justify-content-center bg-success">
                    <div className="position-absolute text-white h5 mb-0">1</div>
                  </div>
                  <div className="ml-3 ml-md-4">
                    <h4>Créer un compte et partagez vos livres</h4>
                    <p>
                      Créer un compte en premier lieu avec vos informations personnelles, puis vous serez amené à déclarer vos livres. Indiquez simplement l'ISBN (au dos du livre) et il sera automatiquement enregistré, visible par tous!
                  </p>
                  </div>
                </li>
                <li className="d-flex align-items-start my-4 my-md-5">
                  <div className="rounded-circle p-3 p-sm-4 d-flex align-items-center justify-content-center bg-success">
                    <div className="position-absolute text-white h5 mb-0">2</div>
                  </div>
                  <div className="ml-3 ml-md-4">
                    <h4>Rechercher un livre</h4>
                    <p>
                      Vous voulez voir si quelqu'un a un livre que vous recherchez? Rien de plus simple? Indiquez dans la barre de recherche le nom du livre, l'auteur ou l'ISBN. Vous pouvez également parcourir via le menu de navigation.
                  </p>
                  </div>
                </li>
                <li className="d-flex align-items-start my-4 my-md-5">
                  <div className="rounded-circle p-3 p-sm-4 d-flex align-items-center justify-content-center bg-success">
                    <div className="position-absolute text-white h5 mb-0">3</div>
                  </div>
                  <div className="ml-3 ml-md-4">
                    <h4>Empruntez et profitez </h4>
                    <p>
                      Une fois le livre trouvé, faites une demande d'emprunt à son propriétaire! Celui-ci vous l'enverra par la poste ou alors, planifiez une rencontre. Vous aurez aussi la possibilité de saisir un avis pour ce livre!
                  </p>
                  </div>
                </li>
                <li className="d-flex align-items-start my-4 my-md-5">
                  <div className="rounded-circle p-3 p-sm-4 d-flex align-items-center justify-content-center bg-success">
                    <div className="position-absolute text-white h5 mb-0">3</div>
                  </div>
                  <div className="ml-3 ml-md-4">
                    <h4>Retournez le livre à son propriétaire</h4>
                    <p>
                      Une fois le livre lu, retournez le à son propriétaire, afin qu'il soit à nouveau visible des autres!
                  </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          {/* <div className='row section-title justify-content-center text-center'>

            <div className="col-md-9 col-lg-8 col-xl-7">
              <h3 claclassNamess="display-4">Les derniers <mark data-aos="highlight-text" data-aos-delay="300" className="aos-init aos-animate">avis</mark></h3>
              <div className="lead">Ci-dessous figurent les derniers avis postés par nos utilisateurs</div>
            </div>
          </div> */}
        </div>
      </section>
        <LastAvis />
    </>);
	}
}

export default Home
