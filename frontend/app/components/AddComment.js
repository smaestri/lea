import React from 'react'
import {FormControl} from 'react-bootstrap'
import {Button} from 'react-bootstrap'

class AddComment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {comm: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        this.props.saveComment(this.state.comm);
        this.setState ({comm: ''});
    }

    handleChange(event){
        this.setState({comm:  event.target.value });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="add-comment-container">
                    <span>Ajouter un commentaire :</span>
                    <FormControl name="message" componentClass="textarea" onChange={this.handleChange} value={this.state.comm} />
                    <Button type="submit" bsStyle="primary" bsSize="small">Valider</Button>
                </div>
          </form>
        )
    }
}

export default AddComment
