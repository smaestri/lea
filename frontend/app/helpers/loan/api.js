import axios from 'axios'

var helpers = {
    getLoan: function (id) {
        return axios.get('/api/emprunts/' + id)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });

    },


    getLoans: () => {
        return axios.get('/api/emprunts')
            .then((response) => {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getHistorizedLoans: () => {
        return axios.get('/api/historized-loans')
            .then((response) => {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getLendings: function () {
        return axios.get('/api/prets')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getHistorizedLendings: function () {
        return axios.get('/api/historized-lendings')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    countEmpruntAndPret: function () {
		return axios.get('/api/countEmpruntAndPret')
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
    },

    isNewPret: function () {
		return axios.get('/api/isNewPret')
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	},
    
    
};

export default helpers