import axios from 'axios'
var helpers = {
	getSvgIcon: function () {
		return SVGIcon;
	},

	fetchBookInfoFromAmazon: function (isbn) {
		return axios.get('/api/getBookInfoFromAmazon/' + isbn);

	}
};

export default helpers
