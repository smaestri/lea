import React from 'react'
import helpers from '../../helpers/api'
import Book from '../book/Book'
import { Button } from 'react-bootstrap'
import { withRouter } from 'react-router'

class UserDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = { name: '', books: [], userFriends:  [] };
		this.returnToPreviousPage = this.returnToPreviousPage.bind(this);
	}

// when returning to userdetail
	componentDidMount(){
		console.log('did mount')
			helpers.getUserDetail(this.props.params.userId).then((user) => {
				this.setState({
					userId: user.id,
					name: user.fullName,
					books: user.livres,
					userFriends: user.userFriends
				});
			});
	}

// when clicking other user on same component
	componentWillReceiveProps(nextProps) {
		console.log('will receive props')
		console.log(nextProps)
		// FIXME : find a Way to not load twice
			helpers.getUserDetail(this.props.params.userId).then((user) => {
				this.setState({
					userId: user.id,
					name: user.fullName,
					books: user.livres,
					userFriends: user.userFriends
				});
			});
	}

	returnToPreviousPage() {
		if (this.props.params.previousPage == 'listBook') {
			this.props.router.push('/list-book')
		}
		else if (this.props.params.previousPage == 'myFriend') {
			this.props.router.push('/my-friends')
		}
		else { // requestedFriend
			this.props.router.push('/my-requested-friends');
		}
	}

	render() {
		let books = this.state.books.map(book => {
			return <Book
			 				  key={book.id}
								id={book.id}
								book={book}
								previousPage="userDetail"
 								userId={this.props.userId}
								/>
		});

		let booksFriends = [];
		this.state.userFriends.map(subFriend => {
			booksFriends = subFriend.livres.map(book => {
				return <Book
									key={book.id}
									id={book.id}
									book={book}
									previousPage="userDetail"
									userId={this.props.userId}
									/>
			});
		})

		//add sub friend books
		/*
		 this.state.user.userFriends.map( user => {
		 return user.livres.map(livre => {
		 books.push(<Book proprietaire={user.fullName} key={livre.id} id={livre.id} book={livre} previousPage="userDetail" />);
		 })
		 });
		 */

		return (
			<div className="container">
				<h1>Livres de {this.state.name}</h1>
				{books.length == 0 && <span>Cet utilisateur n'a pas encore de livres.</span>}
				{books.length > 0 && <div className="book-container">{books}</div>}
				<h1>Livres des amis de {this.state.name}</h1>
				{booksFriends.length > 0 && <div className="book-container">{booksFriends}</div>}
				<Button bsStyle="primary" onClick={this.returnToPreviousPage}>Retour</Button>
			</div>
		)
	}
}

export default withRouter(UserDetail);
