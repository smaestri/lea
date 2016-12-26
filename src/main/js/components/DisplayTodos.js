import React from 'react';
import Todo from './Todo';

class DisplayTodos extends React.Component{

  constructor(props) {
      super(props);
      //this.handleDelete = this.handleDelete.bind(this);
  }

  /*
  componentWillReceiveProps(nextProps){
    console.log('Display todos componentWillReceiveProps')
    console.log(nextProps)
    this.todos = nextProps.todosList;
  }
  */

  render(){
    console.log('render todos')
    console.log(this.props.store.getState())
    let todos =[];
    if (this.props.store && this.props.store.getState() && this.props.store.getState().length){
        todos = this.props.store.getState().map( todo => {
        return <Todo  store={this.props.store} key={todo.id} id={todo.id} data={todo.text} />
      });
    }


    return(
       <ul>{todos}</ul>
    )
  }
}

/*
const mapStateToProps = (state) => {
  return {
    todos: state.todos
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }

}

const TodoList = connect(
    mapStateToProps,
    mapDispatchToProps
)(DisplayTodos)
 */

export default DisplayTodos
