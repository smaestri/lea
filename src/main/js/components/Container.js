import React from 'react';
import Saisie from './Saisie';
import DisplayTodos from './DisplayTodos';


const {Component} = React;

class Container extends Component{

    /*

    put this for the component mangae state themselves

    componentDidMount(){
        const {store} = this.props;
        this.unsubscribe = store.subscribe( () => {
            this.forceUpdate();
        })
    }

    componentWillUnmounr(){
        this.unsubscribe();
    }
    */

  constructor(props) {
      super(props);
      //this.addTodo = this.addTodo.bind(this);
      //this.deleteTodo = this.deleteTodo.bind(this);
      // this._onChange = this._onChange.bind(this);
      console.log('this.props2')
      console.log(this.props)
  }

  render(){
      const props = this.props;
      const {store} = props;
      // const state = store.getState();
    return(
      <div>
        <Saisie store={store} /*onAddtodo={this.props.addTodo}*/ />
        <DisplayTodos store={store} /*todosList={this.props.todos} onDeleteTodo={this.props.deleteTodo}*/ />
      </div>
    )
  }
}

export default Container
