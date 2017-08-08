import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import API from '../api';
import { Link } from 'react-router-dom';
import { Card, Message, Icon } from 'semantic-ui-react';

class Post extends Component {
  componentDidMount() {
    // API.getCommentsForPost(this.props.id);
  }

  render() {
    const {
      id, timestamp, title, body, author, category, voteScore
    } = this.props;

    return (
      <Card>
        <Card.Content>
          <Card.Header>{title}</Card.Header>
          <Card.Meta>Posted {moment(timestamp).fromNow()}</Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Link to={`/posts/${id}`}>
            <Icon name='comment' />
            5 Comments
          </Link>
        </Card.Content>
      </Card>
    );
  }
};

Post.propTypes = {
  id: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  return state.post.posts[id];
};

export default connect(mapStateToProps)(Post);
