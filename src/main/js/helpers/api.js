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


    /*
    // make helpers acting like a store
    notifyChange: function () {
        _changeListeners.forEach(function (listener) {
            listener()
        })
    },

    addChangeListener: function (listener) {
        _changeListeners.push(listener)
    },
    */

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
        console.log('API get MY books')
        return axios.get('/myBooks')
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getAllBooks: function () {
        console.log('API get ALL books')
        return axios.get('/searchBook')
            .then(function (response) {
                _books = response.data;
                console.log(response);
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

    getLendings: function () {
        console.log('API get LENDINGS')
        return axios.get('/prets')
            .then(function (response) {
                _lendings = response.data;
                _loans = undefined;
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getComments: function () {
        console.log('API get comments')
        return axios.get('/comments')
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    loanBook: function (idBook) {
        console.log('API LOAN book')
        return axios.post('/emprunter', {
            idLivre: idBook,
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

    acceptLoan: function (idBook) {
        console.log('API ACCEPT LOAN book')
        return axios.post('/accepterEmprunt/' + idBook, null, {
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

    sendLoan: function (idBook) {
        console.log('API ACCEPT LOAN book')
        return axios.post('/envoyerEmprunt/' + idBook, null, {
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

    closeLoan: function (idBook) {
        console.log('API CLOSE LOAN book')
        return axios.post('/cloreEmprunt/' + idBook, null, {
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

    getBookDetail: function (bookid) {
        console.log('API get book detail')
        return axios.get('/livres/' + bookid)
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getUserDetail: function (userId) {
        console.log('API get user detail')
        return axios.get('/users/' + userId)
            .then(function (response) {
                _books = response.data.livres;
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    deleteBook: function(idBook){
        console.log('DELETE BOOK')
        return axios.delete('/livres/' + idBook, {
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
            console.log('UPDATE BOOK')
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
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        }

        console.log('CREATE BOOK')
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

    saveComment: function (commObj, idComm, idLoan) {
        if (idComm) {
            console.log('UPDATE COMMENT')
            return axios.put('/comments/' + idComm, {
                message: commObj.message
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

        console.log('CREATE COMM')
        return axios.post('/addComment/' + idLoan, {
            message: commObj.message,
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
            console.log('UPDATE AVIS')
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

        console.log('CREATE COMM')
        return axios.post('/avis/' + idBook, {
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
    },

    deleteAvis: function(idAvis){
        console.log('DELETE COMM')
        return axios.delete('/avis/' + idAvis, {
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

    getMyFriends: function () {
        console.log('API get MY Friends')
        return axios.get('/myFriends')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getMyPendingFriends: function () {
        console.log('API get myPendingFriends')
        return axios.get('/myPendingFriends')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getMyRequestedFriends: function () {
        console.log('API get getMyRequestedFriends')
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

    acceptFriend: function (idFriend) {
        return axios.post('/accepterAmi/'+ idFriend ,null , {
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


};

export default helpers



