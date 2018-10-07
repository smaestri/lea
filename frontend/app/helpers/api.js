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
