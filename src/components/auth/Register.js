import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';

class AuthRegister extends React.Component{
  state = {
    errors: {}
  }

  validations = {
    password: {
      message: 'This field is required',
      required: true
    },
    username: {
      message: 'This field is required',
      required: true
    },
    passwordConfirmation: {
      message: 'Passwords do not match',
      required: true
    },
    email: {
      message: 'Please enter a valid email address',
      required: true,
      pattern: /.+@.+\..+/
    },
    tel: {
      message: 'Please enter a valid UK mobile number',
      required: true,
      pattern: /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|#)\d+)?)$/
    }
  }

  getFieldError = (name, value) => {
    const validation = this.validations[name];
    if(validation.pattern && !validation.pattern.test(value) || (!value && validation.required)) return validation.message;
    return '';
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
    const errors = { ...this.state.errors, [name]: '' };
    this.setState({ [name]: value, errors });
  }

  formIsValid = () => {
    return Object.keys(this.validations).every(field => {
      const validation = this.validations[field];
      return (validation.pattern && validation.pattern.test(this.state.field)) && (validation.required && this.state[field]);
    });
  }

  handleBlur = ({target: { name, value }}) => {
    const errors = { ...this.state.errors, [name]: this.getFieldError(name, value) };
    this.setState({ errors });
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <div className="field">
          <label className="username">Username</label>
          <input className="input" name="username" placeholder="Username" onChange={this.handleChange} onBlur={this.handleBlur}/>
          {this.state.errors.username && <small>{this.state.errors.username}</small>}
        </div>
        <div className="field">
          <label className="email">Email</label>
          <input className="input" name="email" placeholder="Email" onChange={this.handleChange} onBlur={this.handleBlur} />
          {this.state.errors.email && <small>{this.state.errors.email}</small>}
        </div>
        <div className="field">
          <label className="tel">Mobile Number</label>
          <input className="input" name="tel" placeholder="Mobile Number" onChange={this.handleChange} onBlur={this.handleBlur} />
          {this.state.errors.tel && <small>{this.state.errors.tel}</small>}
        </div>
        <div className="field">
          <label className="password">Password</label>
          <input className="input" type="password" name="password" placeholder="Password" onChange={this.handleChange} onBlur={this.handleBlur} />
          {this.state.errors.password && <small>{this.state.errors.password}</small>}
        </div>
        <div className="field">
          <label className="passwordConfirmation">Confirm Password</label>
          <input className="input" type="password" name="passwordConfirmation" placeholder="Confirm Password" onChange={this.handleChange} onBlur={this.handleBlur}/>
          {this.state.errors.passwordConfirmation && <small>{this.state.errors.passwordConfirmation}</small>}
        </div>

        <button onClick={this.handleSubmit} disabled={!this.formIsValid()} className="button">Submit</button>
      </form>
    );
  }
}

export default AuthRegister;
