
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import Navbar from './components/common/Navbar';
import EventsIndex from './components/events/Index';
import EventsNew from './components/events/New';
import EventsEdit from './components/events/Edit';
import UsersShow from './components/users/Show';
import AuthRegister from './components/auth/Register';
import AuthLogin from './components/auth/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import FlashMessages from './components/common/FlashMessages';
import EventsShow from './components/events/Show';
import Konami from 'react-konami';
import Push from './lib/Push';

import 'bulma';
import './scss/style.scss';


class App extends React.Component {

  state = {
    easterEggActive: false,
    pushRegistered: false
  };

  componentDidMount = () => {
    Push.initialize()
      .then(res => {
        console.log('REGISTERED', res);
        this.setState({ pushRegistered: true });
      });
  }

  //currently works once per refresh. Find better method than remove();
  konami = () =>{
    this.setState({ easterEggActive: true });
    setTimeout(() => {
      this.setState({ easterEggActive: false });
    },5000);
  }

  render() {
    if(!this.state.pushRegistered) return <h1>Connecting...</h1>;
    return (
      <BrowserRouter>
        <main>
          <Konami easterEgg={this.konami}></Konami>
          <Navbar />
          <FlashMessages />
          <section className="section">
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home} />
                <ProtectedRoute path="/users/:id" component={UsersShow} />
                <ProtectedRoute path="/events/new" component={EventsNew} />
                <ProtectedRoute path="/events/:id/edit" component={EventsEdit}/>
                <ProtectedRoute path="/events/:id" component={EventsShow}/>
                <Route path="/events" component={EventsIndex} />
                <Route path="/register" component={AuthRegister} />
                <Route path="/login" component={AuthLogin} />
                <Route exact component={NotFound} />
              </Switch>
            </div>
          </section>
          {this.state.easterEggActive && <img
            className="panda" src="https://vignette.wikia.nocookie.net/epic-rap-battles-of-cartoons/images/0/00/Panda.png/revision/latest?cb=20170812052841"
          />}
        </main>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
