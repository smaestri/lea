import React from 'react'
import LastAvis from './LastAvis'
import ListCategories from './ListCategories'

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {avis: []};
    }


    render() {
        return(
        <div className="main-content">
           <LastAvis />
           <ListCategories />
        </div>);
    }
}

export default Main
