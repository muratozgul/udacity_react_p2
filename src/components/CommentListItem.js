import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Comment, Icon } from 'semantic-ui-react';
import VoteBox from './VoteBox';

class CommentListItem extends Component {
  render() {
    const { id, thumb, author, timestamp, body, voteScore } = this.props;
    return (
      <Comment key={id}>
        <Comment.Avatar src={thumb} />
        <Comment.Content>
          <Comment.Author style={{ display: 'inline' }}>
            {author}
          </Comment.Author>
          <Comment.Metadata>
            <div>{moment(timestamp).fromNow()}</div>
            <div>
              <Icon name='trophy' />
              {voteScore}
            </div>
          </Comment.Metadata>
          <Comment.Text>{body}</Comment.Text>
          <Comment.Actions>
            <VoteBox id={id} type={'comment'} />
          </Comment.Actions>
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
  voteScore: PropTypes.number,
  thumb: PropTypes.string
};

CommentListItem.defaultProps = {
  voteScore: 0
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  return {
    ...state.comment.comments[id]
  };
};

export default connect(mapStateToProps)(CommentListItem);
