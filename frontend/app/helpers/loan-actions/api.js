import axios from 'axios'

var helpers = {
    loanBook: function (idBook, intermediaireid) {
        return axios.post('/api/emprunter', {
            idLivre: idBook,
            idIntermediaire: intermediaireid
        }/*, {
        headers: { 'X-CSRF-Token': getCsrf() },
    }*/)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    acceptLoan: function (idEmprunt) {
        return axios.post('/api/accepterEmprunt/' + idEmprunt, null/*, {
        headers: { 'X-CSRF-Token': getCsrf() },
    }*/)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    refuseLoan: function (idEmprunt, refus) {
        return axios.post('/api/refuserEmprunt/' + idEmprunt, { refus: refus }/*, {
        headers: { 'X-CSRF-Token': getCsrf() },
    }*/)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    sendLoan: function (idEmprunt) {
		return axios.post('/api/envoyerEmprunt/' + idEmprunt, null/*, {
			headers: { 'X-CSRF-Token': getCsrf() },
		}*/)
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	},

	closeLoan: function (idBook) {
		return axios.post('/api/cloreEmprunt/' + idBook, null /*, {
			headers: { 'X-CSRF-Token': getCsrf() },
		}*/)
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
    },
    
    saveComment: function (message, idComm, idLoan) {
		if (idComm) {
			return axios.put('/api/comments/' + idComm, {
				message: message
			}/*, {
				headers: { 'X-CSRF-Token': getCsrf() },
			}*/)
				.then(function (response) {
					return response.data;
				})
				.catch(function (error) {
					console.log(error);
				});
		}

		return axios.post('/api/addComment/' + idLoan, {
			message: message,
		}/*, {
			headers: { 'X-CSRF-Token': getCsrf() },
		}*/)
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
    },
    
    deleteComment: function (idComm) {
		return axios.delete('/api/comments/' + idComm/*, {
			headers: { 'X-CSRF-Token': getCsrf() },
		}*/)
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	},
};

export default helpers
