import React from 'react'
import {Button} from 'react-bootstrap'
import {Link} from 'react-router'
import formatDate from '../helpers/utils'

class PendingFriend extends React.Component {

    constructor(props) {
        super(props);
        this.state = {friends: [], pendingFriends:[]};
    }

    render() {
        return (
            <div className="friend">
                <div className="imageUser">
                        <img src="/assets/img/add-friend.png" />
                </div>
                {!this.props.showAcceptButton  &&
                <div>
                    <label>Email: </label><span>{this.props.friend.email}</span>
                </div>
                }
                {!this.props.showAcceptButton  &&
                <div>
                    <span>Vous avez ajouté cet ami {formatDate(this.props.friend.dateDemande)}</span>
                </div>
                }
                {this.props.showAcceptButton &&
                <div>
                    <span>{this.props.friend.fullName}</span>
                </div>
                }

                {this.props.showAcceptButton &&
                <div>
                    <label>Email: </label><span>{this.props.friend.email}</span>
                </div>
                }
                {this.props.showAcceptButton &&
                <div className="linkUser">
                    <Link to={'user-detail/' + this.props.friend.id + '/requestedFriend'}>Voir ses livres</Link></div>
                }
                {this.props.showAcceptButton &&
                <div className="accept-button">
                    <Button bsStyle="primary" bsSize="small" onClick={()=>{this.props.acceptRequestFriend(this.props.friend.id)}}>Accepter</Button>
                </div>
                }
                {!this.props.showAcceptButton &&
                <div className="linkUser">
                    <Button bsStyle="primary" bsSize="small"
                            onClick={() => this.props.deletePendingFriend(this.props.friend.id)}>Annuler ma demande</Button>
                </div>
                }
            </div>
        )
    }
}

export default PendingFriend
