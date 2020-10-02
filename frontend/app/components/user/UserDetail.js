import React from 'react'
import helpers from '../../helpers/user/api'
import Book from '../book/Book'
import { Button } from 'react-bootstrap'
import { withRouter } from 'react-router'
import './UserDetail.scss'

class UserDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: '', books: [], userFriends:  [] };
	}

	componentDidMount(){
    this.props.displaySpinner();
		helpers.getUserDetail(this.props.match.params.userId).then((user) => {
      this.props.hideSpinner();
			this.setState({
				userId: user.id,
				name: user.fullName,
				books: user.livres,
				userFriends: user.userFriends
			});
		});
	}

	render() {
		let books = this.state.books.map(book => {
			return <Book
						key={book.id}
						id={book.id}
						book={book}
						currentPage="userDetail"
            userId={this.props.userId}
            displaySpinner={this.props.displaySpinner}
            hideSpinner={this.props.hideSpinner}
					/>
		});

    let booksFriends = [];
		this.state.userFriends.map(subFriend => {

      if(subFriend.livres && subFriend.livres.length > 0 ){
        booksFriends = [...booksFriends, subFriend.livres.map(book => {
          return <Book
                key={book.id}
                id={book.id}
                book={book}
                currentPage="userDetail"
                userId={this.props.userId}
                displaySpinner={this.props.displaySpinner}
                hideSpinner={this.props.hideSpinner}
              />
        })];

      }


    })
		return (
      <section>
        <div className="container">
          <div className="container-user">
            <h1>Livres de {this.state.name}</h1>
              <div className="row justify-content-center">
                <div className="col d-flex flex-wrap justify-content-center">
                  {books.length == 0 && <span>Cet utilisateur n'a pas encore de livres.</span>}
                  {books.length > 0 && <div className="books-user">{books}</div>}
                </div>
              </div>
              <br />
            <h1>Livres des amis de {this.state.name}</h1>
              <div className="row justify-content-center">
                <div className="col d-flex flex-wrap justify-content-center">
                  {booksFriends.length == 0 && <span>Les amis de {this.state.name} n'ont pas encore de livres. </span>}
                  {booksFriends.length > 0 && <div className="books-user">{booksFriends}</div>}
                </div>
              </div>
              {/* <Button bsStyle="primary" onClick={this.props.history.goBack}>Retour</Button> */}
          </div>
          </div>
      </section>
		)
	}
}

export default withRouter(UserDetail);
