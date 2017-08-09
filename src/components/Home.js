import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllPosts } from '../redux/postStore';
import { getAllCategories } from '../redux/categoryStore';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import _ from 'lodash';
import PostList from './PostList';

class Home extends Component {
  componentDidMount() {
    this.props.dispatch(getAllCategories());
    this.props.dispatch(getAllPosts());
  }

  render() {
    const category = _.get(this.props, 'match.params.category', null);

    return (
      <Container>
        <NavBar />
        <PostList category={category} />
      </Container>
    );
  }
};

export default connect()(Home);
