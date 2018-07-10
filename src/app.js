import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import Navbar from './components/common/Navbar';
import EventsIndex from './components/events/Index';
import AuthRegister from './components/auth/Register';
import AuthLogin from './components/auth/Login';
// import ProtectedRoute from './components/common/ProtectedRoute';
// import FlashMessages from './components/common/FlashMessages';


import 'bulma';
import './scss/style.scss';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <main>
          <Navbar />
          <Route exact path="/" component={Home} />
          <section className="section">
            <div className="container">
              <Switch>
                <Route path="/events" component={EventsIndex} />
                <Route path="/register" component={AuthRegister} />
                <Route path="/login" component={AuthLogin} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </section>
        </main>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
