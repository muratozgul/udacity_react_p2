import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Comment } from 'semantic-ui-react';

class CommentListItem extends Component {
  render() {
    const { id, thumb, author, timestamp, body } = this.props;
    return (
      <Comment key={id}>
        <Comment.Avatar src={thumb} />
        <Comment.Content>
          <Comment.Author as='a'>{author}</Comment.Author>
          <Comment.Metadata>
            <div>{moment(timestamp).fromNow()}</div>
          </Comment.Metadata>
          <Comment.Text>{body}</Comment.Text>
        </Comment.Content>
      </Comment>
    );
  }
};

CommentListItem.propTypes = {
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  thumb: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  return {
    ...state.comment.comments[id]
  };
};

export default connect(mapStateToProps)(CommentListItem);
