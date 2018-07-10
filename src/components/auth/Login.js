import React from 'react';
import axios from 'axios';
import Auth from '../lib/Auth';
import Flash from '../lib/Flash';

class AuthLogin extends React.Component{
  state={}

  handleSubmit = (e) =>{
    e.preventDefault();
    axios({
      method: 'POST',
      data: this.state
    });
  }
}
export default AuthLogin; 
