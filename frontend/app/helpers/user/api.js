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

    updateOrCreateUser: function (isCreation, user) {
        if(isCreation) {
            return axios.post('/api/createUser', {
                ...user, creation: "true"
          })
        } else {
            return axios.post('/api/editUser', {
                ...user, creation: "false"
            })
        }
    },

    createUser: function () {
        return axios.post('/api/createUser', {
            email: user.firstName,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            confirmPassword: user.confirmPassword
        })
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

    login: (login, password) => {

        // SPRING SECURITY needs normal form data, not JSON
        var bodyFormData = new FormData();
        bodyFormData.set('username', login);
        bodyFormData.set('password', password);

        return axios.post('/login', bodyFormData,
        { config: { headers: {'Content-Type': 'multipart/form-data' }}}
        )
    },
    logout: () => {
        return axios.post('/logout')
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            alert('erreur during logout')
            console.log(error);
        });

    }
};

export default helpers