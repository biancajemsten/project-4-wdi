import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Switch } from 'react-router-dom';
import Navbar from './components/common/Navbar';

import 'bulma';
import './scss/style.scss';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <main>
          <Navbar />
        </main>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
