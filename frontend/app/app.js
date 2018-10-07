import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { render } from 'react-dom';
import Layout from "./components/home/Layout";

class App extends React.Component {

	render() {
		return (
			<Router>
				<div>
					<Route path="/" component={Layout}/>
				</div>
			</Router>)
	}
}

export default App;

render(<App/>, document.getElementById('app'));
