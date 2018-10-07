import axios from 'axios'

var helpers = {
    getUserDetail: function (userId) {
        return axios.get('/api/users/' + userId)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getUserInfo: function (userId) {
        return axios.get('/api/userInfo/' + userId)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    isAuthenticated: function () {
        return axios.get('/api/isAuthenticated/')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    saveEditUser: function (user) {
        return axios.post('/api/saveEditUser', {
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            confirmPassword: user.confirmPassword
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

    getAccount: function () {
        return axios.get('/api/account')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },
};

export default helpers