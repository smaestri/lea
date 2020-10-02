import React from 'react'
import { FormControl } from 'react-bootstrap'
import { TimelineEvent } from 'react-event-timeline'
import helpersLoan from '../../helpers/loan-actions/api'
import formatDate from '../../helpers/utils'

class Comment extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.deleteComment = this.deleteComment.bind(this);

    this.state = {
      editMode: false,
      oldMessage: '',
      message: ''
    }
  }

  componentDidMount() {
    this.setState({
      message: this.props.comment.message,
      oldMessage: this.props.comment.message
    });
  }

  handleChange(event) {
    this.setState({
			message: event.target.value
		});
  }

  render() {
    let dateMessage = formatDate(this.props.comment.dateMessage);
    return (
      <TimelineEvent
        key={this.props.comment.id}
        title={this.props.userConnected == this.props.comment.user.id ? "Vous avez saisi :" : this.props.comment.user.fullName + " a saisi le commentaire suivant:"}
        createdAt={dateMessage}
        icon={<i className="material-icons md-18">email</i>}
        iconColor="navy"
        buttons={this.props.userConnected == this.props.comment.auteur && this.props.isActive && (this.state.editMode ?
          [
            <i key="done" onClick={this.saveEditComment.bind(this)} className="material-icons md-18" style={{ color: 'navy' }}>done</i>,
            <i key="close" onClick={this.undoEditComment.bind(this)} className="material-icons md-18" style={{ color: 'navy' }}>close</i>
          ] :
          [
            <i key="edit" onClick={this.editComment.bind(this)} className="material-icons md-18" style={{ color: 'navy' }}>mode_edit</i>,
            <i key="delete" onClick={this.deleteComment.bind(this)} className="material-icons md-18" style={{ color: 'navy' }}>delete</i>
          ]
        )
        }
      >
        <div className='comment-container'>
          {this.state.editMode &&
            <FormControl
              name="message"
              componentClass="textarea"
              onChange={this.handleChange}
              value={this.state.message} />}
          {!this.state.editMode && <span className="txt-comment">{this.state.message}</span>}
        </div>
      </TimelineEvent>
    )
  }

  editComment() {
    this.setState({
      editMode: true
    });
  }

  undoEditComment() {
    if (this.state.oldMessage) {
			this.setState({
        message: this.state.oldMessage,
        editMode: false
      });
    }
		else {
			this.setState({
				editMode: false
			});
		}
  }

  saveEditComment() {
    helpersLoan.saveComment(this.state.message, this.props.comment.id).then(() => {
      this.props.reloadEmprunt();
    });
  }

  deleteComment() {
    helpersLoan.deleteComment(this.props.comment.id).then(() => {
      this.props.reloadEmprunt();
    });
  }
}

export default Comment
