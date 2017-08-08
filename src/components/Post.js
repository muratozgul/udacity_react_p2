import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import VisibilitySensor from 'react-visibility-sensor';
import { Card } from 'semantic-ui-react';
import CommentList from './CommentList';

class Post extends Component {
  render() {
    const {
      id, timestamp, title, body, author, category, voteScore, comments
    } = this.props;

    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>{title}</Card.Header>
          <Card.Meta>Posted {moment(timestamp).fromNow()}</Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra style={{ paddingTop: 0, paddingBottom: 0 }}>
          <VisibilitySensor
            active={comments == null}
            onChange={this.loadComments}
          />
          <div style={{ minHeight: '34px' }}>
            <CommentList postId={id} />
          </div>
        </Card.Content>
      </Card>
    );
  }
};

Post.propTypes = {
  id: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  category: PropTypes.string,
  voteScore: PropTypes.number
};

PropTypes.defaultProps = {
  voteScore: 0
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  return {
    ...state.post.posts[id]
  };
};

export default connect(mapStateToProps)(Post);
