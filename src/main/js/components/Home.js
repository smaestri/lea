import React from 'react';
import MainMenu from './MainMenu';
import SearchBar from './SearchBar';
import TopMenu from './TopMenu';

const {Component} = React;

class Home extends Component{

  render(){
      const props = this.props;
      const {store} = props;
    return(
      <div>
        <TopMenu store={store} />
        <SearchBar store={store}  />
        <MainMenu store={store}  />
        {this.props.children}
      </div>
    )
  }
}

export default Home
