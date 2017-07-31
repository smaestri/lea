require('es6-promise').polyfill();
import axios from 'axios'
import React from 'react'

// cache for loans, lendings, books
let _loans = [];
let _lendings = [];
let _books = [];

/*
function getCsrf() {
	var metas = document.getElementsByTagName('meta');
	for (var i = 0; i < metas.length; i++) {
		if (metas[i].name == "_csrf") {
			return metas[i].content;
		}
	}
	return "";
};
*/

export const SVGIcon = React.createClass({
	render: function () {
		// Namespaced attributes are not supported in JSX. As a workaround
		// we can use the dangerouslySetInnerHTML to set the innerHTML property.
		// See https://github.com/facebook/react/issues/2250
		var svg =
			'<svg class="' + this.props.className + '">' +
			'<use xlink:href="' + this.props.href + '"></use>' +
			'</svg>';
		return React.createElement('div', {
			dangerouslySetInnerHTML: { __html: svg }
		});
	}
});

var helpers = {
	getLoan: function (id) {
		if (_loans && _loans.length > 0) {
			return _loans.filter((loan) => loan.id == id)[0]
		}

		if (_lendings && _lendings.length > 0) {
			return _lendings.filter((loan) => loan.id == id)[0]
		}
	},

	getBook: function (id) {
		if (_books && _books.length > 0) {
			return _books.filter((book) => book.id == id)[0]
		}
	},

	getMyBooks: function () {
		return axios.get('/api/myBooks')
			.then(function (response) {
				_books = response.data;
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	},

	getAllBooks: function () {
		return axios.get('/api/searchBook')
			.then(function (response) {
				_books = response.data;
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	},

	getLoans: () => {
		return axios.get('/api/emprunts')
			.then((response) => {
				_loans = response.data;
				_lendings = undefined;
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
				_loans = undefined;
				_lendings = response.data;
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

	getComments: function () {
		return axios.get('/api/comments')
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	},

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

	countEmpruntAndPret: function () {
		return axios.get('/api/countEmpruntAndPret')
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

	getBookDetail: function (bookid) {
		return axios.get('/api/livres/' + bookid)
			.then(function (response) {
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
	},

	getUserDetail: function (userId) {
		return axios.get('/api/users/' + userId)
			.then(function (response) {
				_books = response.data;
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

	deleteComment: function (idComm) {
		console.log('DELETE COMM')
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

	saveBook: function (bookObj) {
		if (bookObj.id) {
			return axios.put('/api/livres/' + bookObj.id, {
				titreBook: bookObj.titreBook,
				auteur: bookObj.auteur,
				description: bookObj.description,
				isbn: bookObj.isbn,
				categorieId: bookObj.categorieId
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
			//TODO SPREAD OPERATOR?
			titreBook: bookObj.titreBook,
			auteur: bookObj.auteur,
			description: bookObj.description,
			isbn: bookObj.isbn,
			categorieId: bookObj.categorieId
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

	saveAvis: function (avisObj, idAvis, idBook) {
		if (idAvis) {
			return axios.put('/api/avis/' + idAvis, {
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

	getMyFriends: function () {
		return axios.get('/api/myFriends')
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

	getCategories: function () {
		return axios.get('/api/getCategories')
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

	isNewPret: function () {
		return axios.get('/api/isNewPret')
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

	getSvgIcon: function () {
		return SVGIcon;
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

};

export default helpers
