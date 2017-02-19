import axios from 'axios';

// cache for loans, lendings, books
let _loans = [];
let _lendings = [];
let _books = [];


function getCsrf() {
    var metas = document.getElementsByTagName('meta');
    for (var i = 0; i < metas.length; i++) {
        if (metas[i].name == "_csrf") {
            return metas[i].content;
        }
    }
    return "";
}

var helpers = {
    getLoan: function (id) {
        if (_loans && _loans.length > 0){
            return _loans.filter((loan) => loan.id == id)[0]
        }

        if (_lendings && _lendings.length > 0){
            return _lendings.filter((loan) => loan.id == id)[0]
        }
    },

    getBook: function (id) {
        if (_books && _books.length > 0){
            return _books.filter((book) => book.id == id)[0]
        }

    },

    getMyBooks: function () {
        return axios.get('/myBooks')
            .then(function (response) {
                _books = response.data;
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getAllBooks: function () {
        return axios.get('/searchBook')
            .then(function (response) {
                _books = response.data;
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getLoans:  () => {
        console.log('API get LOANS')
        return axios.get('/emprunts')
            .then((response) =>  {
                _loans = response.data;
                _lendings= undefined;
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },


    getHistorizedLoans:  () => {
        return axios.get('/historized-loans')
            .then((response) =>  {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getLendings: function () {
        return axios.get('/prets')
            .then(function (response) {
                _loans = undefined;
                _lendings= response.data;
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getHistorizedLendings: function () {
        return axios.get('/historized-lendings')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getComments: function () {
        return axios.get('/comments')
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    loanBook: function (idBook, intermediaireid) {
        return axios.post('/emprunter', {
            idLivre: idBook,
            idIntermediaire: intermediaireid
        }, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    acceptLoan: function (idEmprunt) {
        return axios.post('/accepterEmprunt/' + idEmprunt, null, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    refuseLoan: function (idEmprunt, refus) {
        return axios.post('/refuserEmprunt/' + idEmprunt, {refus: refus}, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    countEmpruntAndPret: function() {
        return axios.get('/countEmpruntAndPret')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });

    },

    getAccount: function() {
        return axios.get('/account')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });

    },


    sendLoan: function (idEmprunt) {
        return axios.post('/envoyerEmprunt/' + idEmprunt, null, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    closeLoan: function (idBook) {
        return axios.post('/cloreEmprunt/' + idBook, null, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getBookDetail: function (bookid) {
        console.log('API get book detail')
        return axios.get('/livres/' + bookid)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getUserDetail: function (userId) {
        return axios.get('/users/' + userId)
            .then(function (response) {
                _books = response.data;
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getUserInfo: function (userId) {
        return axios.get('/userInfo/' + userId)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    deleteBook: function(idBook){
        return axios.delete('/livres/' + idBook, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    deleteComment: function(idComm){
        console.log('DELETE COMM')
        return axios.delete('/comments/' + idComm, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    saveBook: function (bookObj, idBook) {
        if (idBook) {
            return axios.put('/livres/' + idBook, {
                //TODO SPREAD OPERATOR?
                titreBook: bookObj.titreBook,
                auteur: bookObj.auteur,
                description: bookObj.description,
                isbn: bookObj.isbn,
                categorieId: bookObj.categorieId
            }, {
                headers: {'X-CSRF-Token': getCsrf()},
            })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        }

        return axios.post('/livres/new', {
            //TODO SPREAD OPERATOR?
            titreBook: bookObj.titreBook,
            auteur: bookObj.auteur,
            description: bookObj.description,
            isbn: bookObj.isbn,
            categorieId: bookObj.categorieId
        }, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });

    },

    saveComment: function (message, idComm, idLoan) {
        if (idComm) {
            return axios.put('/comments/' + idComm, {
                message: message
            }, {
                headers: {'X-CSRF-Token': getCsrf()},
            })
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        return axios.post('/addComment/' + idLoan, {
            message: message,
        }, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },


    saveAvis: function (avisObj, idAvis, idBook) {
        if (idAvis) {
            return axios.put('/avis/' + idAvis, {
                note: avisObj.note,
                libelle: avisObj.libelle,
            }, {
                headers: {'X-CSRF-Token': getCsrf()},
            })
                .then(function (response) {
                    console.log(response);
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        return axios.post('/avis/' + idBook, {
            note: avisObj.note,
            libelle: avisObj.libelle,
        }, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    deleteAvis: function(idAvis){
        return axios.delete('/avis/' + idAvis, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getMyFriends: function () {
        return axios.get('/myFriends')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },


    getLastAvis: function () {
        return axios.get('/getLastAvis')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getMyPendingFriends: function () {
        return axios.get('/myPendingFriends')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getMyRequestedFriends: function () {
        return axios.get('/myRequestedFriends')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },


    savePendingFriend: function (email) {
        return axios.post('/ami/new/' , {email1: email}, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    saveEditUser: function (user) {
        return axios.post('/saveEditUser' , {firstName: user.firstName, lastName: user.lastName, password: user.password, confirmPassword: user.confirmPassword}, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    acceptFriend: function (idFriend) {
        return axios.post('/accepterAmi/'+ idFriend ,null , {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    deleteFriend: function(idFriend){
        return axios.delete('/friend/' + idFriend, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    deletePendingFriend: function(idFriend){
        return axios.delete('/pendingFriend/' + idFriend, {
            headers: {'X-CSRF-Token': getCsrf()},
        })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

};

export default helpers



