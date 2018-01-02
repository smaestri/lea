import React from 'react'
import helpers from '../../helpers/api'
import Book from '../book/Book'
import { Button } from 'react-bootstrap'
import { withRouter } from 'react-router'
import style from './UserDetail.scss'

class UserDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: '', books: [], userFriends:  [] };
		this.returnToPreviousPage = this.returnToPreviousPage.bind(this);
	}

	componentDidMount(){
		helpers.getUserDetail(this.props.params.userId).then((user) => {
			this.setState({
				userId: user.id,
				name: user.fullName,
				books: user.livres,
				userFriends: user.userFriends
			});
		});
	}

	componentWillReceiveProps(nextProps) {
		console.log(this.props)
		console.log(nextProps)
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
		else {
			this.props.router.push('/my-requested-friends');
		}
	}

	render() {
		let books = this.state.books.map(book => {
			return <Book
						key={book.id}
						id={book.id}
						book={book}
						currentPage="userDetail"
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
							currentPage="userDetail"
							userId={this.props.userId}
						/>
			});
		})

		return (
			<div className="container-user">
				<h1>Livres de {this.state.name}</h1>
				{books.length == 0 && <span>Cet utilisateur n'a pas encore de livres.</span>}
				{books.length > 0 && <div className="books-user">{books}</div>}
				<h1>Livres des amis de {this.state.name}</h1>
				{booksFriends.length > 0 && <div className="books-user">{booksFriends}</div>}
				<Button bsStyle="primary" onClick={this.returnToPreviousPage}>Retour</Button>
			</div>
		)
	}
}

export default withRouter(UserDetail);
