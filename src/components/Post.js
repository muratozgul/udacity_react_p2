import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, Image, Icon } from 'semantic-ui-react';
import CommentList from './CommentList';
import VoteBox from './VoteBox';

class Post extends Component {
  render() {
    const {
      id, timestamp, title, body, author, category, voteScore, thumb
    } = this.props;

    return (
      <Card fluid>
        <Card.Content>
          <Image floated='left' size='mini' src={thumb} />
          <Card.Header>{title}</Card.Header>
          <Card.Meta>
            <span><b>{author}</b> {moment(timestamp).fromNow()}</span>
            <Icon name='trophy' />
            <span>{voteScore}</span>
            <VoteBox id={id} type={'post'} />
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra style={{ paddingTop: 0, paddingBottom: 0 }}>
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
  voteScore: PropTypes.number,
  thumb: PropTypes.string
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
