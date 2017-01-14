import React from 'react'
import Rating from 'react-rating'
import helpers from '../helpers/api'

class AddAvis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {editMode: false, rating: props.rating};
        this.handleRating = this.handleRating.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleEditmode = this.toggleEditmode.bind(this);
    }

    toggleEditmode(){
        this.setState({
            editMode: !this.state.editMode
        });
    }

    handleRating(event){
        console.log('handleRating')
        console.log(event)
        const rating = this.state.rating;
        rating["note"] = event;
        this.setState({rating: rating });
    }

    handleChange(event){
        console.log('handleChange')
        const rating = this.state.rating;
        rating[event.target.name] = event.target.value;
        this.setState({rating: rating });
    }


    saveAvis(){
        console.log('saveAvis')
        helpers.saveAvis(this.state.rating, null, this.props.bookId).then( (avis) => {
            console.log('avis inserted')
        });
    }

    saveEditAvis(){
        console.log('saveAvis')
        helpers.saveAvis(this.state.rating, null, this.props.bookId).then( (avis) => {
           console.log('avis inserted')
        });
    }

    deleteAvis(){
        console.log('handleSubmit')
        helpers.saveAvis(this.state.rating, null, this.props.bookId).then( (avis) => {
            console.log('avis inserted')
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
        return (
         <div>
             <Rating readonly={} initialRate={this.props.rating} onClick={this.handleRating} />
             {this.state.rating && this.state.rating.id && !this.state.editMode && <button onClick={this.toggleEditmode}>Edit</button>}
             {this.state.rating && this.state.rating.id && !this.state.editMode && <button onClick={this.deleteAvis}>Delete</button>}
             {this.state.rating && this.state.rating.id && this.state.editMode && <button onClick={this.undoEdit}>Annuler</button>}
             {this.state.rating && this.state.rating.id && this.state.editMode && <button onClick={this.saveEditAvis}>Sauvegarder</button>}

             {!(this.state.rating && this.state.rating.id) && <textarea name="libelle" onChange={this.handleChange}>{this.state.rating.libelle}</textarea>}
             {this.state.rating && this.state.rating.id && <span>{this.state.rating.libelle}</span>}
             {!(this.state.rating && this.state.rating.id) && <button onClick={this.saveAvis}>Submit</button>}
         </div>
        )
    }
}

export default AddAvis
