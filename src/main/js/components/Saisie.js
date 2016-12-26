import React from 'react';
import {addTodo} from '../actions/TodoActions';

class Saisie extends React.Component{

  constructor(props) {
    super(props);
    this.state = {value: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render(){
    console.log('this.props')
    console.log(this.props)
    console.log(this.state)
    return(
      <div>
        <input type="text" onChange={this.handleChange} />
        <button onClick={this.handleClick} >
        Submit
        </button>
      </div>
    )
  }

  handleClick(){
    console.log('handle click')
    console.log(this.props)
    this.props.store.dispatch(addTodo(this.state.value));
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

}

//Saisie = connect()(Saisie)
export default Saisie
