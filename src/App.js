import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { initializeAPI } from './api';
import { initializeStore } from './redux';
import Home from './components/Home';

initializeAPI();
const store = initializeStore();

class App extends Component {
  // http://redux.js.org/docs/advanced/UsageWithReactRouter.html
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="app">
            <Route exact path="/" component={Home} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
