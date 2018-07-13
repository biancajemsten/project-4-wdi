import React from 'react';
import axios from 'axios';

class UsersShow extends React.Component {

  state = {}

  componentDidMount() {
    axios({
      method: 'GET',
      url: `/api/users/${this.props.match.params.id}`
    })
      .then(res => {
        const user = res.data;
        this.setState({ user });
      });
  }

  render() {
    console.log(this.state.user);
    return(
      <div>
        <h1 className="title is-1">USERS</h1>
        {this.state.user && <h2 className="title is-2">{`${this.state.user.username}'s Events`}</h2>}
      </div>
    );
  }
}

export default UsersShow;
