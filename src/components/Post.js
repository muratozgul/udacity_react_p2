import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { getCommentsForPost } from '../redux/commentStore';
import { Link } from 'react-router-dom';
import VisibilitySensor from 'react-visibility-sensor';
import { Card, Message, Icon, Loader, Accordion, Comment } from 'semantic-ui-react';

class Post extends Component {
  loadComments = (isVisible) => {
    // @see https://github.com/joshwnj/react-visibility-sensor
    if (isVisible) {
      this.props.dispatch(getCommentsForPost(this.props.id));
    }
  }

  renderComments() {
    const { comments } = this.props;
    return (
      <Comment.Group>
        {
          comments.map(comment => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.thumb} />
              <Comment.Content>
                <Comment.Author as='a'>{comment.author}</Comment.Author>
                <Comment.Metadata>
                  <div>{moment(comment.timestamp).fromNow()}</div>
                </Comment.Metadata>
                <Comment.Text>{comment.body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))
        }
      </Comment.Group>
    );
  }

  renderCommentBar() {
    const { comments, commentsLoading, commentsLoadError } = this.props;
    if (commentsLoading) {
      return <Loader inverted>Loading Comments</Loader>;
    }
    else if (commentsLoadError) {
      return <span>ERROR {commentsLoadError.message}</span>
    }
    else if (Array.isArray(comments)) {
      const num = comments.length;
      return (
        <Accordion styled={false}>
          <Accordion.Title>
            <Icon name='comment' />{num} Comments
            { num > 0 ? <Icon name='dropdown' /> : null }
          </Accordion.Title>
          <Accordion.Content>
            { num > 0 ? this.renderComments() : null }
          </Accordion.Content>
        </Accordion>
      );
    } else {
      // load Comments button
      return <span>Load Comments Button</span>
    }
  }

  render() {
    const {
      id, timestamp, title, body, author, category, voteScore, comments
    } = this.props;

    return (
      <Card>
        <Card.Content>
          <Card.Header>{title}</Card.Header>
          <Card.Meta>Posted {moment(timestamp).fromNow()}</Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <VisibilitySensor
            active={comments == null}
            onChange={this.loadComments}
          />
          {this.renderCommentBar()}
        </Card.Content>
      </Card>
    );
  }
};

{/* <Link to={`/posts/${id}`}> */}

Post.propTypes = {
  id: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  const commentIdsArray = _.get(state.comment.postIdMap, `${id}.comments`, null);
  let comments = null;
  if (Array.isArray(commentIdsArray)) {
    comments = commentIdsArray.map(id => state.comment.comments[id]);
  }
  return {
    ...state.post.posts[id],
    comments,
    commentsLoading: _.get(state.comment.postIdMap, `${id}.loading`, false),
    commentsLoadError: _.get(state.comment.postIdMap, `${id}.error`, null)
  };
};

export default connect(mapStateToProps)(Post);
