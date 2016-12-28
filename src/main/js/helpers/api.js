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

    getBooks: function () {
        console.log('API get books')
        return axios.get('/myBooks')
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



