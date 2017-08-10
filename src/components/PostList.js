import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid, Item } from 'semantic-ui-react';
import Post from './Post';

class PostList extends Component {
  render() {
    const { posts } = this.props;
    const postComponents = posts.map(post => {
      return (
        <Grid.Row key={post.id}>
          <Grid.Column>
            <Post id={post.id} />
          </Grid.Column>
        </Grid.Row>
      );
    });

    return <Grid columns={1}>{postComponents}</Grid>;
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
  const { sortBy, sortOrder } = state.post;
  let posts = _.values(state.post.posts);
  if (_.isString(category)) {
    posts = _.values(posts).filter(post => post.category === category);
  }
  posts = posts.sort((a, b) => {
    const temp = a[sortBy] - b[sortBy];
    const modifier = sortOrder === 'asc' ? 1 : -1;
    return  temp * modifier; 
  });
  return { posts };
};

export default connect(mapStateToProps)(PostList);
