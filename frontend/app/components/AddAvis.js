import React from 'react'
import Rating from 'react-rating'
import helpers from '../helpers/api'
import {Button} from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'
import formatDate from '../helpers/utils'
import {SVGIcon} from '../helpers/api'

class AddAvis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {editMode: props.avis.length > 0 ? true:false, avis: props.avis};
        this.handleRating = this.handleRating.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveAvis = this.saveAvis.bind(this);
        this.saveEditAvis = this.saveEditAvis.bind(this);
        this.deleteAvis = this.deleteAvis.bind(this);
        this.toggleEditmode = this.toggleEditmode.bind(this);
        this.undoEdit = this.undoEdit.bind(this);
    }

    toggleEditmode(){
        this.setState({
            editMode: !this.state.editMode
        });
    }

    handleRating(event){
        const newAvis = this.state.avis;
        newAvis["note"] = event;
        this.setState({avis: newAvis });
    }

    handleChange(event){
        const newAvis = this.state.avis;
        newAvis["libelle"] = event.target.value;
        this.setState({avis: newAvis });
    }

    saveAvis(){
        helpers.saveAvis(this.state.avis, null, this.props.bookId).then( (newAvisId) => {
            this.setState({editMode: false, avis: Object.assign(this.state.avis, {id: newAvisId})  });
        });
    }

    saveEditAvis(){
        helpers.saveAvis(this.state.avis, this.state.avis.id, this.props.bookId).then( () => {
            this.setState({editMode: false });
        });
    }

    deleteAvis(){
        helpers.deleteAvis(this.state.avis.id).then( () => {
            this.setState({avis: {}, editMode: true});
        });
    }

    undoEdit(){
        this.setState({
            editMode: false
        });
    }

    render() {
        let showTextArea = false;
        // display if state not setted
        if(!this.state.avis.id){
            showTextArea = true;
        }
        else{
            if (this.state.editMode){
                showTextArea = true;
            }
        }
        let dateAvis;
        if(this.state.avis.dateavis){
            dateAvis = formatDate(this.state.avis.dateavis);
        }

        return (
         <div className="avis-container">
             <h3>Noter ce livre</h3>
             <div className="avis-content">
                 {dateAvis && <div>Ajouté le {dateAvis}</div>}
                 <div className="avis-note">
                     <label>Note: </label>
                     <Rating empty={<SVGIcon  href='#icon-star-empty' className='icon-rating'/>}
                             full={<SVGIcon  href='#icon-star-full' className='icon-rating'/>}
                             readonly={!showTextArea}
                             initialRate={this.state.avis.note}
                             onClick={this.handleRating} />
                 </div>
                 <div className="avis-txt">
                     <label>Message: </label>{!showTextArea && <span><blockquote>{this.state.avis.libelle}</blockquote></span>}
                     { showTextArea && <FormControl name="libelle" componentClass="textarea" onChange={this.handleChange} value={this.state.avis.libelle} />}
                 </div>
             </div>
             <div className="avis-buttons">
                 {this.state.avis && this.state.avis.id && !this.state.editMode && <Button bsStyle="primary" bsSize="small" onClick={this.toggleEditmode}>Modifier</Button>}
                 {this.state.avis && this.state.avis.id && !this.state.editMode && <Button bsStyle="primary" bsSize="small" onClick={this.deleteAvis}>Supprimer</Button>}
                 {this.state.avis && this.state.avis.id && this.state.editMode && <Button bsStyle="primary" bsSize="small" onClick={this.undoEdit}>Annuler</Button>}
                 {this.state.avis && this.state.avis.id && this.state.editMode && <Button bsStyle="primary" bsSize="small" onClick={this.saveEditAvis}>Sauvegarder</Button>}
                 {(!this.state.avis || !this.state.avis.id) && <Button bsStyle="primary" bsSize="small" onClick={this.saveAvis}>Valider</Button>}
             </div>
         </div>
        )
    }
}

export default AddAvis
