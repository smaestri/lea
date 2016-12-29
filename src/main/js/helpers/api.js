import axios from 'axios';

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
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getLoans: function () {
        console.log('API get LOANS')
        return axios.get('/emprunts')
            .then(function (response) {
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

    }

};

export default helpers



