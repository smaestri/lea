import axios from 'axios'

var helpers = {
    getMyFriends: function () {
        return axios.get('/api/myFriends')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getMyPendingFriends: function () {
        return axios.get('/api/myPendingFriends')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getMyRequestedFriends: function () {
        return axios.get('/api/myRequestedFriends')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    savePendingFriend: function (email) {
		return axios.post('/api/ami/new/', { email1: email }/*, {
			headers: { 'X-CSRF-Token': getCsrf() },
		}*/)
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
    },
    
    acceptFriend: function (idFriend) {
		return axios.post('/api/accepterAmi/' + idFriend, null/*, {
			headers: { 'X-CSRF-Token': getCsrf() },
		}*/)
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	},

	deleteFriend: function (idFriend) {
		return axios.delete('/api/friend/' + idFriend/*, {
			headers: { 'X-CSRF-Token': getCsrf() },
		}*/)
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	},

	deletePendingFriend: function (idFriend) {
		return axios.delete('/api/pendingFriend/' + idFriend/*, {
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