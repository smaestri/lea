import React from 'react'
import { withRouter } from 'react-router';


class Book extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
         <div>
             Avis : {avis}
         </div>
        )
    }
}

export default withRouter(Book)
