import React from 'react'
import style from './CommentMarche.scss'

export default class CommentMarche extends React.Component {
    render() {
        return (<div>
            <h3>Comment ça marche</h3>
			<div className='container-comment-marche'>
                <div className="line">
                    <div className="title-aide">1 - Enregistrer mes livres: </div>
                    <div>Je m'inscris sur le site et déclare mes livres via leur ISBN, que je pourrai prêter à mes amis</div>
                </div>
                <div className="line">
                    <div className="title-aide">2 - Trouver un livre: </div>
                    <div>Je parcours la site à la recherche d'un livre qui me plait. Une fois trouvé, je fais une demande d'emprunt à son propriétaire!</div>
                </div>
                <div className="line">
                    <div className="title-aide">3 - Lecture du livre et renvoie: </div>
                    <div>Le prêteur du livre accepte ma demande, il devient mon ami, et je lui retourne son livre. Je peux voir tous ses livres!</div>
                </div>
                <div className="line">
                    <div className="title-aide">4 - Cloture de l'emprunt: </div>
                    <div>Le prêteur a bien reçu le livre, il peut clôre l'emprunt.</div>
                </div>
			</div>
            </div>
		);
    }
}
