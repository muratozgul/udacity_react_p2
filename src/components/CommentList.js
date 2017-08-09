import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getCommentsForPost } from '../redux/commentStore';
import VisibilitySensor from 'react-visibility-sensor';
import { Icon, Loader, Accordion, Comment } from 'semantic-ui-react';
import CommentListItem from './CommentListItem';

class CommentList extends Component {
  loadComments = (isVisible) => {
    // @see https://github.com/joshwnj/react-visibility-sensor
    if (isVisible) {
      this.props.dispatch(getCommentsForPost(this.props.postId));
    }
  }

  renderComments() {
    const { commentIdsArray } = this.props;
    const num = commentIdsArray.length;
    return (
      <Accordion styled={false}>
        <Accordion.Title>
          <Icon name='comment' />{num} Comments
          { num > 0 ? <Icon name='dropdown' /> : null }
        </Accordion.Title>
        <Accordion.Content>
          {
            num <= 0
            ? null
            : <Comment.Group>
              {
                commentIdsArray.map(commentId => {
                  return <CommentListItem key={commentId} id={commentId} />
                })
              }
            </Comment.Group>
          }
        </Accordion.Content>
      </Accordion>
    );
  }

  renderLoading() {
    return (
      <div style={{ height: '34px', display: 'flex', alignItems: 'center' }}>
        <Loader active inline size='mini'/>
        <span style={{ marginLeft: '8px', fontSize: 12, opacity: 0.5 }}>
          Loading comments...
        </span>
      </div>
    )
  }

  renderError() {
    return (
      <div style={{ height: '34px', display: 'flex', alignItems: 'center' }}>
        <Icon disabled name='warning sign' style={{ marginBottom: '4px' }} />
        <span style={{ marginLeft: '8px', fontSize: 12, opacity: 0.5 }}>
          Failed to load comments
        </span>
      </div>
    );
  }

  renderCommentBar() {
    const { commentIdsArray, commentsLoading, commentsLoadError } = this.props;
    if (commentsLoading) {
      return this.renderLoading();
    }
    else if (commentsLoadError) {
      return this.renderError();
    }
    else if (Array.isArray(commentIdsArray)) {
      return this.renderComments();
    } else {
      return null;
    }
  }

  render() {
    const { commentIdsArray } = this.props;

    return (
      <div style={{ minHeight: '34px' }}>
        <VisibilitySensor
          active={commentIdsArray == null}
          onChange={this.loadComments}
        />
        {this.renderCommentBar()}
      </div>
    );
  }
};

CommentList.propTypes = {
  postId: PropTypes.string.isRequired,
  commentIdsArray: PropTypes.arrayOf(PropTypes.string),
  commentsLoading: PropTypes.bool,
  commentsLoadError: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { postId } = ownProps;
  const commentIdsArray = _.get(state.comment.postIdMap, `${postId}.comments`, null);
  return {
    commentIdsArray,
    commentsLoading: _.get(state.comment.postIdMap, `${postId}.loading`, false),
    commentsLoadError: _.get(state.comment.postIdMap, `${postId}.error`, null)
  };
};

export default connect(mapStateToProps)(CommentList);