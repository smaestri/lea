import React from 'react'
import { FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import formatDate from '../../helpers/utils'

class Comment extends React.Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event){
		this.props.handleChange(event.target.value, this.props.comment.id);
	}

	render() {
		let dateMessage = formatDate(this.props.comment.dateMessage);
		return (
				<div className='comment-container'>
					{this.props.comment.editMode &&
						 <FormControl
							name="message"
							componentClass="textarea"
							onChange={this.handleChange}
                			value={this.props.comment.message}/>}
					{!this.props.comment.editMode && <span className="txt-comment">{this.props.comment.message}</span>}
				</div>
		)
	}
}

export default Comment
