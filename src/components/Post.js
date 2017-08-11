import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import {
  Card, Image, Icon, Popup, Button, Dimmer, Header, Loader, Label, Segment
} from 'semantic-ui-react';
import CommentList from './CommentList';
import VoteBox from './VoteBox';
import { getPost } from '../redux/postStore';
import { openEditForm } from '../redux/postFormStore';
import { intentDeletePost, cancelDeletePost, confirmDeletePost } from '../redux/postStore';

class Post extends Component {
  componentDidMount() {
    const { id, post } = this.props;
    if (post == null) {
      this.props.dispatch(getPost(id));
    }
  }

  handleEdit = () => {
    const { dispatch, id } = this.props;
    dispatch(openEditForm(id));
  }

  handleDeleteIntent = () => {
    const { dispatch, id } = this.props;
    dispatch(intentDeletePost(id));
  }

  handleConfirmDelete = () => {
    const { dispatch, id, isDetailView, history } = this.props;
    let redirect;
    if (isDetailView) {
      redirect = () => history.push('/');
    }
    dispatch(confirmDeletePost(id, redirect));
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

  renderPost() {
    const { isDetailView } = this.props;
    const {
      id, timestamp, title, body, author, category, voteScore, thumb
    } = this.props.post;
    const showDimmer = id === this.props.delete.id;

    return (
      <Dimmer.Dimmable as={Card} fluid blurring dimmed={showDimmer}>
        <Dimmer active={showDimmer}>
          {this.renderDeleteConfirmation()}
        </Dimmer>
        <div style={{ position: 'absolute', right: '13px', top: '2px' }}>
          <Label size='mini' ribbon='right'>{_.upperFirst(category)}</Label>
        </div>
        <Card.Content>
          <Image floated='left' size='mini' src={thumb} />
          <Card.Header>
            {
              isDetailView
              ? title
              : <Link to={`/${category}/${id}`}>{title}</Link>
            }
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
            <CommentList postId={id} startOpen={isDetailView} />
          </div>
        </Card.Content>
      </Dimmer.Dimmable>
    );
  }

  render() {
    const { id, post } = this.props;
    const { loading, error } = post || {};

    if (loading) {
      return (
        <Loader active inline='centered' />
      );
    } else if (error) {
      return (
        <Segment color='red' textAlign='center'>
          <Icon name='warning sign' color='red' />
          Failed to load the post
        </Segment>
      );
    } else if (post != null) {
      return this.renderPost();
    } else {
      return null;
    }
  }
};

Post.propTypes = {
  id: PropTypes.string.isRequired,
  post: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.object,
  delete: PropTypes.object
};

PropTypes.defaultProps = {
  delete: {}
};

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id || ownProps.match.params.postId;
  return {
    id,
    post: state.post.posts[id],
    delete: state.post.delete,
    isDetailView: _.get(ownProps.match, 'params.postId')
  };
};

export default withRouter(connect(mapStateToProps)(Post));
