import axios from 'axios'
var helpers = {
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
