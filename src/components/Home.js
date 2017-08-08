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

// const mapStateToProps = (state, ownProps) => {};
// const mapDispatchToProps = (dispatch, ownProps) => {};

export default connect()(Home);
