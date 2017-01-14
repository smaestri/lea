import React from 'react'

class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {editMode: false, comm:{}};
        this.toggleEditmode = this.toggleEditmode.bind(this);
        this.undoEdit = this.undoEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveEditComment = this.saveEditComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    toggleEditmode(){
        this.setState({
            editMode: !this.state.editMode
        });
    }

    handleChange(event){
        const comm = this.state.comm;
        comm[event.target.name] = event.target.value;
        this.setState({comm: comm });
    }

    deleteComment(){
        this.props.deleteComment(this.props.id);
    }

    saveEditComment(){
        //event.preventDefault();
        this.props.saveEditComment(this.state.comm, this.props.id);
        this.setState({editMode: false });
    }

    undoEdit(){
        this.setState({
            editMode: false
        });
    }

    render() {
        return (
            <li>
                <div>
                    <span>Ajouté le {this.props.dateMessage} par {this.props.auteur}</span>
                    {!this.state.editMode && this.props.displayButtons && <button onClick={this.toggleEditmode}>Edit</button>}
                    {!this.state.editMode && this.props.displayButtons && <button onClick={this.deleteComment}>Delete</button>}
                    {this.state.editMode && this.props.displayButtons && <button onClick={this.undoEdit}>Annuler</button>}
                    {this.state.editMode && this.props.displayButtons && <button onClick={this.saveEditComment}>Sauvegarder</button>}
                </div>
               <div>
                       {this.state.editMode && <textarea name="message" onChange={this.handleChange}>{this.props.message}</textarea>}
                       {!this.state.editMode && <span>{this.props.message}</span>}
               </div>
            </li>
        )
    }
}

export default Comment
