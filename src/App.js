import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { initializeAPI } from './api';
import { initializeStore } from './redux';
import { Container } from 'semantic-ui-react';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Post from './components/Post';

initializeAPI();
const store = initializeStore();

class App extends Component {
  // @see http://redux.js.org/docs/advanced/UsageWithReactRouter.html
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className='app'>
            <Container>
              <NavBar />
              <Route exact path='/' component={Home} />
              <Route exact path='/:category' component={Home} />
              <Route path='/:category/:postId' component={Post} />
            </Container>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
