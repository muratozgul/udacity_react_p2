import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, Image, Icon, Popup, Button, Dimmer, Header, Loader } from 'semantic-ui-react';
import CommentList from './CommentList';
import VoteBox from './VoteBox';
import { openEditForm } from '../redux/postFormStore';
import { intentDeletePost, cancelDeletePost, confirmDeletePost } from '../redux/postStore';

class Post extends Component {
  handleEdit = () => {
    const { dispatch, id } = this.props;
    dispatch(openEditForm(id));
  }

  handleDeleteIntent = () => {
    const { dispatch, id } = this.props;
    dispatch(intentDeletePost(id));
  }

  handleConfirmDelete = () => {
    const { dispatch, id } = this.props;
    dispatch(confirmDeletePost(id));
  }

  handleCancelDelete = () => {
    const { dispatch } = this.props;
    dispatch(cancelDeletePost());
  }

  renderDeleteConfirmation = () => {
    const { deleting, error } = this.props.delete;
    if (deleting) {
      return <Loader>Deleting...</Loader>
    } else if (error) {
      return (
        <div>
          <Header as='h2' inverted>Something went wrong!</Header>
          <Button onClick={this.handleCancelDelete}>Cancel</Button>
          <Button primary onClick={this.handleConfirmDelete}>Retry</Button>
        </div>
      );
    } else {
      return (
        <div>
          <Header as='h2' inverted>Delete this post?</Header>
          <Button onClick={this.handleCancelDelete}>Cancel</Button>
          <Button color='red' onClick={this.handleConfirmDelete}>Confirm</Button>
        </div>
      );
    }
  }

  render() {
    const {
      id, timestamp, title, body, author, category, voteScore, thumb
    } = this.props;
    const showDimmer = id === this.props.delete.id;

    return (
      <Dimmer.Dimmable as={Card} fluid blurring dimmed={showDimmer}>
        <Dimmer active={showDimmer} onClickOutside={() => {}}>
          {this.renderDeleteConfirmation()}
        </Dimmer>
        <Card.Content>
          <Image floated='left' size='mini' src={thumb} />
          <Card.Header>
            {title}
          </Card.Header>
          <Card.Meta>
            <span><b>{author}</b> {moment(timestamp).fromNow()}</span>
            <Icon name='trophy' />
            <span>{voteScore}</span>
            <VoteBox id={id} type={'post'} />
            <Popup
              trigger={
                <a onClick={this.handleEdit}>
                  <Icon name='edit' />
                </a>
              }
              size='mini' inverted
              position='bottom center'
              content='Edit Post'
            />
            <Popup
              trigger={
                <a onClick={this.handleDeleteIntent}>
                  <Icon name='trash outline' />
                </a>
              }
              size='mini' inverted
              position='bottom center'
              content='Delete Post'
            />
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ minHeight: '34px' }}>
            <CommentList postId={id} />
          </div>
        </Card.Content>
      </Dimmer.Dimmable>
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
  voteScore: PropTypes.number,
  thumb: PropTypes.string,
  deleting: PropTypes.bool,
  deleteIntent: PropTypes.object
};

PropTypes.defaultProps = {
  voteScore: 0,
  delete: {}
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  return {
    ...state.post.posts[id],
    delete: state.post.delete,
  };
};

export default connect(mapStateToProps)(Post);
