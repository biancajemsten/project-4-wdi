
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import Navbar from './components/common/Navbar';
import EventsIndex from './components/events/Index';
import EventsNew from './components/events/New';
import EventsEdit from './components/events/Edit';
import AuthRegister from './components/auth/Register';
import AuthLogin from './components/auth/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import FlashMessages from './components/common/FlashMessages';
import EventsShow from './components/events/Show';
import Konami from 'react-konami';

import 'bulma';
import './scss/style.scss';


class App extends React.Component {
//currently works once per refresh. Find better method than remove();
  konami = () =>{
    const element = (
      <img id="panda" className="panda" src="https://vignette.wikia.nocookie.net/epic-rap-battles-of-cartoons/images/0/00/Panda.png/revision/latest?cb=20170812052841"/>
    );
    ReactDOM.render(element, document.getElementById('konami'));
    setTimeout(() => {
      document.getElementById('panda').remove();
    },5000);
  }

  render() {
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
                <ProtectedRoute path="/events/new" component={EventsNew} />
                <Route path="/events/:id/edit" component={EventsEdit}/>
                <Route path="/events/:id" component={EventsShow}/>
                <Route path="/events" component={EventsIndex} />
                <Route path="/register" component={AuthRegister} />
                <Route path="/login" component={AuthLogin} />
                <Route exact component={NotFound} />
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
