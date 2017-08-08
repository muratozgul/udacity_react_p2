import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllPosts } from '../redux/postStore';
import PostList from './PostList';

class Home extends Component {
  componentDidMount() {
    this.props.dispatch(getAllPosts());
  }

  render() {
    return <PostList />;
  }
};

export default connect()(Home);
