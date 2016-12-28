import React from 'react'
import { Link } from 'react-router'

class Book extends React.Component{

    render(){
        console.log('BOOK - this.props')
        console.log(this.props)


        return(
            <li>{this.props.titreBook} -
               <Link to={"/edit-book/" + this.props.id }>Edit</Link>
               <a id="deleteBook">Delete
               </a> -
            </li>
        )
    }

}

export default Book
