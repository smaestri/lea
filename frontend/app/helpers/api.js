require('es6-promise').polyfill();
import axios from 'axios'
import React from 'react'

/*
function getCsrf() {
	var metas = document.getElementsByTagName('meta');
	for (var i = 0; i < metas.length; i++) {
		if (metas[i].name == "_csrf") {
			return metas[i].content;
		}
	}
	return "";
};
*/

export const SVGIcon = React.createClass({
	render: function () {
		// Namespaced attributes are not supported in JSX. As a workaround
		// we can use the dangerouslySetInnerHTML to set the innerHTML property.
		// See https://github.com/facebook/react/issues/2250
		var svg =
			'<svg class="' + this.props.className + '">' +
			'<use xlink:href="' + this.props.href + '"></use>' +
			'</svg>';
		return React.createElement('div', {
			dangerouslySetInnerHTML: { __html: svg }
		});
	}
});

var helpers = {
	
	//
	// getComments: function (empruntId) {
	// 	return axios.get('/api/comments/' + empruntId)
	// 		.then(function (response) {
	// 			return response.data;
	// 		})
	// 		.catch(function (error) {
	// 			console.log(error);
	// 		});
	// },
	
	getSvgIcon: function () {
		return SVGIcon;
	},


	fetchBookInfoFromAmazon: function (isbn) {
		return axios.get('/api/getBookInfoFromAmazon/' + isbn)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			console.log(error);
		});

	}

};

export default helpers
