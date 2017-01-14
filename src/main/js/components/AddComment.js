import React from 'react'

class AddComment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {comm: {}};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        this.props.saveComment(this.state.comm);
    }

    handleChange(event){
        const comm = this.state.comm;
        comm[event.target.name] = event.target.value;
        this.setState({comm: comm });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
              Ajouter un commentaire :
              <textarea name="message" onChange={this.handleChange}></textarea>
              <input type="submit" value="Submit" />
          </form>
        )
    }
}

export default AddComment
