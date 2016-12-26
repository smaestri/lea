import React from 'react';
import {deleteTodo} from '../actions/TodoActions';

class Todo extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
     this.props.store.dispatch(deleteTodo(this.props.id));
    }

    render() {
        return (
            <li>{this.props.id} - {this.props.data}
                - <a href="#" onClick={this.handleDelete}>Supprimer</a>
            </li>
        )
    }
}

export default Todo
