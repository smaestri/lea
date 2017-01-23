import React from 'react'

class AddFriend extends React.Component {

    constructor(props) {
        super(props);
        this.state = {emailFriend: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        this.props.savePendingFriend(this.state.emailFriend);
    }

    handleChange(event){
        let mailToAdd = event.target.value;
        this.setState({emailFriend: mailToAdd });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
              Saisir le mail de la personne:
              <textarea name="email" onChange={this.handleChange}></textarea>
              <input type="submit" value="Submit" />
            </form>
        )
    }
}

export default AddFriend
