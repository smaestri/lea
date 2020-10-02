import React from 'react'
import Rating from 'react-rating'
import { Button } from 'react-bootstrap'
import { TimelineEvent } from 'react-event-timeline'
import { FormControl } from 'react-bootstrap'
import helpersBook from '../../helpers/book/api'
import formatDate from '../../helpers/utils'
import { SVGIcon } from '../common/SVGIcon'

class EditAvis extends React.Component {

	constructor(props) {
		super(props);
		this.handleRating = this.handleRating.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleEditAvisChange = this.handleEditAvisChange.bind(this);
    this.saveEditAvis = this.saveEditAvis.bind(this)
		this.undoEditAvis = this.undoEditAvis.bind(this)
    this.deleteAvis = this.deleteAvis.bind(this)
    this.editAvis = this.editAvis.bind(this)

    this.state= {
      editMode: false,
      oldAvis: {},
      avis: {}
    }
  }
  
  componentDidMount(){
    this.setState({
      avis: this.props.avis,
			oldAvis: this.props.avis
		});
  }

	handleRating(event) {
		const newAvis =  Object.assign({}, this.state.avis);
		newAvis["note"] = event;
		this.handleEditAvisChange(newAvis);
	}

	handleMessageChange(event) {
		const newAvis = Object.assign({}, this.state.avis);
		newAvis["libelle"] = event.target.value;
		this.handleEditAvisChange(newAvis);
  }

  handleEditAvisChange(avisChanged) {
    this.setState({
			avis: avisChanged
		});
  }

	render() {
		return (
      <TimelineEvent
      key={this.state.avis.id}
      title={this.props.auteurAvis + "saisi la note suivante "}
      createdAt={formatDate(this.state.avis.dateavis)}
      icon={<i className="material-icons md-18">favorite</i>}
      iconColor="navy"
      buttons={this.props.userConnected == this.state.avis.auteur && this.props.isActive && (this.state.editMode ?
        [
          <i onClick={this.saveEditAvis.bind(this)} className="material-icons md-18" style={{ color: 'navy' }}>done</i>,
          <i onClick={this.undoEditAvis.bind(this)} className="material-icons md-18" style={{ color: 'navy' }}>close</i>
        ] :
        [
          <i onClick={this.editAvis.bind(this)} className="material-icons md-18" style={{ color: 'navy' }}>mode_edit</i>,
          <i onClick={this.deleteAvis.bind(this)} className="material-icons md-18" style={{ color: 'navy' }}>delete</i>
        ]
      )
      }
      >
     	<div>
				<Rating initialRating={this.state.avis.note}
						readonly={!this.state.editMode}
						onClick={this.handleRating} />
				{!this.state.editMode && <span>{this.state.avis.libelle}</span>}
				{this.state.editMode && <FormControl
					value={this.state.avis.libelle}
					name="libelle"
					componentClass="textarea"
					onChange={this.handleMessageChange} />}
			</div>
    </TimelineEvent>
		
		)
  }

  editAvis() {
		this.setState({
			editMode: true
		});
	}
  
  undoEditAvis() {
		if (this.state.oldAvis) {
			this.setState({
				avis: Object.assign(this.state.avis,
          { 
            note: this.state.oldAvis.note,
            libelle: this.state.oldAvis.libelle
          }),
          editMode: false,
      });
    }
		else {
			this.setState({
				avis: Object.assign(avis, { editMode: false })
			});
		}
  }

	saveEditAvis() {
		// const avis = this.state.events.find(ev => ev.dateavis != undefined)
		helpersBook.saveAvis(this.state.avis, this.props.livreModelId).then(() => {
      this.props.reloadEmprunt();
      this.setState(
        { editMode: false})
		});
	}

	deleteAvis() {
		helpersBook.deleteAvis(this.props.livreModelId, this.state.avis.id).then(() => {
			this.props.reloadEmprunt();
		});
	}
}

export default EditAvis
