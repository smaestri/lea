import React from 'react'
import helpers from '../helpers/api'
import { withRouter } from 'react-router';

class EditBook extends React.Component{

    constructor(props) {
        super(props);
        this.state={book: {titreBook: '', auteur: '', description: '', isbn: '', categorieId: ''  }}
       // this.state={book: 'titi'};
        console.log('Edit book this.props')
        console.log(this.props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.handleChangeAuteur = this.handleChangeAuteur.bind(this);
    }

    componentDidMount(){
        console.log('get book detail')
        //if id passed load exising book
        if(this.props.params && this.props.params.bookId ){
            helpers.getBookDetail(this.props.params.bookId).then((book) => {
                //TODO : dispatch REDUX ACTION type LOAD
                this.setState({book: book });
            })
        }

    }

    render(){
        console.log('render')
        // get categories
        let catJson = document.getElementById("categories").value;
        console.log('cat')
        let cat = JSON.parse(catJson);
        console.log(cat)

        const catReact = cat.map( category => {
            return <option value={category.id}>{category.name}</option>
        });

        return(
            <form onSubmit={this.handleSubmit}>
                <label>
                    titre:
                    <input type="text" name="titreBook" value={this.state.book.titreBook} onChange={this.handleChange} />
                </label>
                <label>
                    auteur:
                    <input type="text" name="auteur"  value={this.state.book.auteur} onChange={this.handleChange} />
                </label>
                <label>
                    description:
                    <input type="text" name="description"  value={this.state.book.description} onChange={this.handleChange} />
                </label>
                <label>
                    isbn:
                    <input type="text" name="isbn" value={this.state.book.isbn} onChange={this.handleChange} />
                </label>
                <label>
                    Catégorie
                    <select name="categorieId" value={this.state.book.categorieId} onChange={this.handleChange}>
                        {catReact}
                    </select>
                </label>

                <input type="submit" value="Submit" />
            </form>
        )
    }

    handleSubmit(event){
        console.log("handleSubmit")
        console.log(this.state.book);
        event.preventDefault();
        helpers.saveBook(this.state.book, (this.props.params.bookId)?this.props.params.bookId:undefined).then((book) => {
            console.log('redirect to my books');
            this.props.router.push('/my-books')
        });

    }

    handleChange(event) {

        const book = this.state.book;
        book[event.target.name] = event.target.value;
        console.log("set state")
        console.log(book)
        this.setState({book: book });
    }
}

export default withRouter(EditBook);
