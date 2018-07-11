class Auth {

  static logout(){
    localStorage.removeItem('token');
  }

  static getToken(){
    localStorage.getItem('token');
  }

  static setToken(token){
    localStorage.setItem('token', token);
  }

  static getPayload(){
    const token = this.getToken();
    if(!token) return null;
    const parts = token.split('.');
    if(parts.length< 3) return null;
    return JSON.parse(atob(parts[1]));
  }

  static isAuthenticated(){
    const payload = this.getPayload();
    if(!payload || !payload.exp) return false;
    const now = Math.round(Date.now() / 1000);
    return now < payload.exp;
  }
}

export default Auth;
