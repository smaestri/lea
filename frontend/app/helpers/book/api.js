var helpers = {

    getCategories: function () {
        return axios.get('/api/getCategories')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getBook: function (id) {
        return axios.get('/api/livres/' + id)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getMyBooks: function () {
        return axios.get('/api/myBooks')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getAllBooks: function (category) {
        const url = '/api/searchBook' + (category ? "?categorie=" + category : '');
        return axios.get(url)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getBookDetail: function (bookid) {
        return axios.get('/api/livres/' + bookid)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    deleteBook: function (idBook) {
        return axios.delete('/api/livres/' + idBook/*, {
			headers: { 'X-CSRF-Token': getCsrf() },
		}*/)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    saveBook: function (bookObj) {
        if (bookObj.id) {
            return axios.put('/api/livres/' + bookObj.id, {
                titreBook: bookObj.titreBook,
                auteur: bookObj.auteur,
                description: bookObj.description,
                isbn: bookObj.isbn,
                categorieId: bookObj.categorieId,
                image: bookObj.image
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

        return axios.post('/api/livres/new', {
            titreBook: bookObj.titreBook,
            auteur: bookObj.auteur,
            description: bookObj.description,
            isbn: bookObj.isbn,
            categorieId: bookObj.categorieId,
            image: bookObj.image
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

    saveAvis: function (avisObj, idBook) {
        if (avisObj.id) {
            return axios.put('/api/avis/' + avisObj.id + '/' + idBook, {
                note: avisObj.note,
                libelle: avisObj.libelle,
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

        return axios.post('/api/avis/' + idBook, {
            note: avisObj.note,
            libelle: avisObj.libelle,
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

    deleteAvis: function (idAvis) {
        return axios.delete('/api/avis/' + idAvis/*, {
			headers: { 'X-CSRF-Token': getCsrf() },
		}*/)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    getLastAvis: function () {
        return axios.get('/api/getLastAvis')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    },

};

export default helpers