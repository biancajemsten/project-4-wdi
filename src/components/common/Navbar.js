import React from 'react';
import { Link, withRouter } from 'react-router-dom';
// import Auth from '../../lib/Auth';

class Navbar extends React.Component {

  state = {
    navbarOpen: false
  }

  toggleNavbar = () => {
    this.setState({ navbarOpen: !this.state.navbarOpen });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ navbarOpen: false });
    }
  }

  render() {
    return(
      <nav className="navbar" role="navigation" aria-label="main-navigation">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <img src="https://images-eu.ssl-images-amazon.com/images/I/51c%2B4XiU5vL._SL500_AC_SS350_.jpg" height="50" />
          </Link>

          <a
            role="button"
            className={`navbar-burger${this.state.navbarOpen ? ' is-active' : ''}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={this.toggleNavbar}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className={`navbar-menu${this.state.navbarOpen ? ' is-active' : ''}`}>
          <div className="navbar-end">
            {/* {!Auth.isAuthenticated() && <Link to="/login" className="navbar-item">Login</Link>}
            {!Auth.isAuthenticated() &&<Link to="/register" className="navbar-item">Register</Link>}
            {Auth.isAuthenticated() && <Link to="/" className="navbar-item" onClick={Auth.logout}>Logout</Link>} */}
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
