import React from 'react'
import {Link} from 'react-router'

class MyBook extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        console.log('h click');
        this.props.handleDelete(e, this.props.id);
    }


    render() {
        return (
            <li>{this.props.titreBook} -
                <Link to={"/edit-book/" + this.props.id }>Edit</Link>
                <a href="#" onClick={this.handleClick}>Delete</a>
            </li>
        )
    }
}

export default MyBook
