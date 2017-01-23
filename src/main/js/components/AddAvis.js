import React from 'react'
import Rating from 'react-rating'
import helpers from '../helpers/api'

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
        helpers.saveAvis(this.state.avis, null, this.props.bookId).then( () => {
            this.setState({editMode: false});
        });
    }

    saveEditAvis(){
        helpers.saveAvis(this.state.avis, this.state.avis.id, this.props.bookId).then( () => {
            this.setState({editMode: false});
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

        // get initial rate for this book and this user

        /*
        this.props.bookRates.avis.forEach ( (avis) => {
            console.log(avis);
        })
*/

        const showTextArea = (!this.state.editMode && ( !this.state.avis || !this.state.avis.id) )||
            (this.state.editMode)

        return (
         <div>
             <Rating readonly={!showTextArea} initialRate={this.props.avis.note} onClick={this.handleRating} />
             {this.state.avis && this.state.avis.id && !this.state.editMode && <span>{this.props.avis.libelle}</span>}
             { showTextArea && <textarea name="libelle" onChange={this.handleChange}>{this.props.avis.libelle}</textarea>}

             {this.state.avis && this.state.avis.id && !this.state.editMode && <button onClick={this.toggleEditmode}>Edit</button>}
             {this.state.avis && this.state.avis.id && !this.state.editMode && <button onClick={this.deleteAvis}>Delete</button>}
             {this.state.avis && this.state.avis.id && this.state.editMode && <button onClick={this.undoEdit}>Annuler</button>}
             {this.state.avis && this.state.avis.id && this.state.editMode && <button onClick={this.saveEditAvis}>Sauvegarder</button>}
             {(!this.state.avis || !this.state.avis.id) && <button onClick={this.saveAvis}>Submit</button>}
         </div>
        )
    }
}

export default AddAvis
