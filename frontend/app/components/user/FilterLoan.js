import React from 'react'
import { Col, FormGroup, FormControl, Button, Form, ButtonToolbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import {loadSvg} from '../../helpers/utils'
import { Redirect } from 'react-router-dom'
import helpers from '../../helpers/user/api'
import { Modal } from 'react-bootstrap'
import './Account.scss'

class FilterLoan extends React.Component {

  constructor(props) {
    super(props);

  }

	
  render() {



    return (this.props.loanHistorized.length > 0 || this.props.loansActives.length > 0) && <div className="row justify-content-center">
            <div class="custom-control custom-radio mr-4" onClick={this.props.clickActive}>
              <input type="radio" id="radio-1" name="radio" className="custom-control-input" checked={this.props.displayActive} />
              <label className="custom-control-label" for="radio-1">Actifs</label>
            </div>
            <div class="custom-control custom-radio mr-4" onClick={this.props.clickInactive}>
              <input type="radio" id="radio-2" name="radio" className="custom-control-input" checked={!this.props.displayActive} />
              <label className="custom-control-label" for="radio-2">Clos</label>
            </div>
          </div>
    
  }
}

export default FilterLoan
