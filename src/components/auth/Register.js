import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';

class AuthRegister extends React.Component{
  state = {
    errors: {
      username: ''
    }
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

  handleChange = ({target: { name, value }}) => {
    this.setState({ [name]: value });
  }

  handleBlur = ({target: { name, value }}) => {
    if(value.length === 0) {
      // const errorMessage = 'This field is required';
      // console.log(this.state.errors);
      const errors = this.state.errors;
      const errorMessage = 'This field is required';
      for(let field in errors) {
        field = name;
        errors[field] = errorMessage;
        return this.setState({errors});
      }
    }
  }

  render() {
    console.log(this.state);
    return(
      <form onSubmit={this.handleSubmit}>
        <div className="field">
          <label className="username">Username</label>
          <input className="input" name="username" placeholder="Username" onChange={this.handleChange} onBlur={this.handleBlur}/>
          {this.state.errors.username && <small>{this.state.errors.username}</small>}
          {/* {this.state.errorMessage && <small>{this.state.errorMessage}</small>} */}
        </div>
        <div className="field">
          <label className="email">Email</label>
          <input className="input" name="email" placeholder="Email" onChange={this.handleChange} onBlur={this.handleBlur} />
          {this.state.errors.email && <small>{this.state.errors.email}</small>}
          {/* {this.state.errorMessage && <small>{this.state.errorMessage}</small>} */}
        </div>
        <div className="field">
          <label className="tel">Telephone Number</label>
          <input className="input" name="tel" placeholder="Telephone Number" onChange={this.handleChange} onBlur={this.handleBlur} />
          {this.state.errors.tel && <small>{this.state.errors.tel}</small>}
          {/* {this.state.errorMessage && <small>{this.state.errorMessage}</small>} */}
        </div>
        <div className="field">
          <label className="password">Password</label>
          <input className="input" type="password" name="password" placeholder="Password" onChange={this.handleChange} onBlur={this.handleBlur} />
          {/* {this.state.errorMessage && <small>{this.state.errorMessage}</small>} */}
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
