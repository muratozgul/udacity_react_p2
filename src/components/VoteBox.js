import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

class VoteBox extends Component {
  handleUpVote = () => {
    console.log('upvote');
  }

  handleDownVote = () => {
    console.log('downvote');
  }

  render() {
    const { id, type } = this.props;
    return (
      <div>
        <Icon name='like outline' size='large'
          color='blue' className='like'
          disabled={false} onClick={this.handleUpVote}
        />
        <Icon name='dislike outline' size='large'
          color='blue' className='like'
          disabled={false} onClick={this.handleDownVote}
        />
      </div>
    );
  }

  // {/* <Button.Group size='mini' compact>
  //   <Button>One</Button>
  //   <Button.Or />
  //   <Button>Three</Button>
  // </Button.Group> */}
};

VoteBox.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['post', 'comment'])
};

export default connect()(VoteBox);
