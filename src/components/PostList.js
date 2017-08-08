import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Post from './Post';

class PostList extends Component {
  render() {
    const { posts } = this.props;
    const postComponents = posts.map(post => {
      return <Post key={post.id} id={post.id} />;
    });

    return <div>{postComponents}</div>;
  }
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  category: PropTypes.string
};

PostList.defaultProps = {
  posts: []
};

const mapStateToProps = (state, ownProps) => {
  const { category } = ownProps;
  let posts = _.values(state.post.posts);
  if (_.isString(category)) {
    posts = _.values(posts).filter(post => post.category === category);
  }
  return { posts };
};

export default connect(mapStateToProps)(PostList);
