import React from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import { render } from 'react-dom';
import Layout from "./components/home/Layout";
import ScrollToTop from "./components/common/ScrollToTop";

class App extends React.Component {
	render() {
		return (
			<Router>
				<ScrollToTop>
					<Route path="/" component={Layout}/>
				</ScrollToTop>
				
			</Router>)
	}
}

export default App;

render(<App/>, document.getElementById('app'));
