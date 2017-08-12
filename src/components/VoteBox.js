import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button, Icon, Comment } from 'semantic-ui-react';
import { upVoteComment, downVoteComment } from '../redux/commentStore';
import { upVotePost, downVotePost } from '../redux/postStore';

const VOTE_INTERVAL_MS = 500;

class VoteBox extends Component {
  constructor(props) {
    super(props);
    this.handleUpVote = _.throttle(
      this._handleUpVote, VOTE_INTERVAL_MS, { trailing: false }
    );
    this.handleDownVote = _.throttle(
      this._handleDownVote, VOTE_INTERVAL_MS, { trailing: false }
    );
  }

  _handleUpVote = () => {
    const { id, type, dispatch } = this.props;
    const isComment = type === 'comment';
    if (isComment) {
      dispatch(upVoteComment(id));
    } else {
      dispatch(upVotePost(id));
    }
  }

  _handleDownVote = () => {
    const { id, type, dispatch } = this.props;
    const isComment = type === 'comment';
    if (isComment) {
      dispatch(downVoteComment(id));
    } else {
      dispatch(downVotePost(id));
    }
  }

  render() {
    const { id, type } = this.props;
    const isComment = type === 'comment';
    // const style = isComment ? null : { display: 'inline-block' };
    const style = { display: 'inline-block' };
    return (
      <div style={style}>
        <Comment.Action onClick={this.handleUpVote}>
          <Icon name='thumbs outline up' />
          {isComment ? 'Like' : null}
        </Comment.Action>
        <Comment.Action onClick={this.handleDownVote}>
          <Icon name='thumbs outline down' />
          {isComment ? 'Dislike' : null}
        </Comment.Action>
      </div>
    );
  }
};

VoteBox.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['post', 'comment'])
};

export default connect()(VoteBox);
