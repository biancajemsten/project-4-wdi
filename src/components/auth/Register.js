import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';

class AuthRegister extends React.Component{
  state= {
    errors: {}
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios({
      url: '/api/register',
      method: 'POST',
      data: this.state
    })
      .then(res => {
        Auth.setToken(res.data.token);
        this.props.history.push('/login');
      })
      .catch(err => this.setState({ errors: err.response.data.errors}));
  }

  handleChange = ({target: {name, value}}) => {
    this.setState({ [name]: value });
  }

  render() {
    console.log(this.state.errors);
    return(
      <form onSubmit={this.handleSubmit}>
        <div className="field">
          <label className="username">Username</label>
          <input className="input" name="username" placeholder="Username" onChange={this.handleChange}/>
          {this.state.errors.username && <small>{this.state.errors.username}</small>}
        </div>
        <div className="field">
          <label className="email">Email</label>
          <input className="input" name="email" placeholder="Email" onChange={this.handleChange}/>
          {this.state.errors.email && <small>{this.state.errors.email}</small>}
        </div>
        <div className="field">
          <label className="tel">Telephone Number</label>
          <input className="input" name="tel" placeholder="Telephone Number" onChange={this.handleChange}/>
          {this.state.errors.tel && <small>{this.state.errors.tel}</small>}
        </div>
        <div className="field">
          <label className="password">Password</label>
          <input className="input" type="password" name="password" placeholder="Password" onChange={this.handleChange}/>
        </div>
        <div className="field">
          <label className="passwordConfirmation">Password Confirmation</label>
          <input className="input" type="password" name="passwordConfirmation" placeholder="Password Confirmation" onChange={this.handleChange}/>
          {this.state.errors.password && <small>{this.state.errors.password}</small>}
        </div>

        <button className="button">Submit</button>
      </form>
    );
  }

}

export default AuthRegister;
