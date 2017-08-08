import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllPosts } from '../redux/postStore';
import { Container } from 'semantic-ui-react';
import PostList from './PostList';

class Home extends Component {
  componentDidMount() {
    this.props.dispatch(getAllPosts());
  }

  render() {
    return <Container><PostList /></Container>;
  }
};

export default connect()(Home);
