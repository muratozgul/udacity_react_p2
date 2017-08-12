import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Form, Button, Loader, Header, Icon, Input, Dimmer
} from 'semantic-ui-react';
import {
  submitForm, formChange, discardForm
} from '../redux/commentFormStore';

class CommentForm extends Component {
  componentWillUnmount() {
    this.handleDiscard();
  }

  handleDiscard = () => {
    const { formType, id } = this.props;
    this.props.dispatch(discardForm(formType, id));
  };

  handleSubmit = () => {
    const { formType, id } = this.props;
    this.props.dispatch(submitForm(formType, id));
  }

  handleChange = (e, { name, value }) => {
    const { formType, id } = this.props;
    this.props.dispatch(formChange(formType, id, name, value));
  }

  renderError() {
    return (
      <Dimmer active>
        <div>
          <Header size='tiny' inverted style={{ marginBottom: '8px'}}>
            Something went wrong!
          </Header>
          <Button size='mini' onClick={this.handleDiscard}>Cancel</Button>
          <Button size='mini' primary onClick={this.handleSubmit}>Retry</Button>
        </div>
      </Dimmer>
    );
  }

  renderForm() {
    const {
      submitDisabled, submitting, submitError, author, body, formType
    } = this.props;
    return (
      <Form loading={submitting} size='mini' loading={submitting}>
        { submitError ? this.renderError() : null }
        <Form.Group>
          <Form.TextArea name='body' onChange={this.handleChange}
            value={body} placeholder='Add your comment here...' width={12}
          />
          <Form.Field width={4} style={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {
              formType === 'new'
              ? <Input name='author' value={author} className='margin-on-mobile'
                placeholder='Your username' onChange={this.handleChange} />
              : <Button size='mini' fluid className='margin-on-mobile'
                  onClick={this.handleDiscard}>Cancel</Button>
            }
            <Button size='mini' fluid className='margin-on-mobile'
              primary onClick={this.handleSubmit} disabled={submitDisabled}
            >
              { formType === 'edit' ? 'Update' : 'Comment' }
            </Button>
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }

  render() {
    const { submitError } = this.props;
    return this.renderForm();
    // return submitError ? this.renderError() : this.renderForm();
  }
};

CommentForm.propTypes = {
  submitDisabled: PropTypes.bool,
  submitting: PropTypes.bool,
  submitError: PropTypes.object,
  author: PropTypes.string,
  body: PropTypes.string,
  formType: PropTypes.oneOf(['new', 'edit'])
};

CommentForm.defaultProps = {
  submitDisabled: true,
  submitting: false,
  submitError: null,
  author: '',
  body: ''
};

const mapStateToProps = (state, ownProps) => {
  const { formType, id } = ownProps;
  let commentData;
  if (formType === 'edit') {
    commentData = state.commentForm.editComments[id];
  } else {
    commentData = state.commentForm.newComments[id];
  }

  const requiredFields = ['body'];
  if (formType === 'new') {
    requiredFields.push('author');
  }
  const submitDisabled = !commentData || requiredFields.some(field => {
    const value = commentData[field];
    return !(_.isString(value) && _.trim(value).length > 0);
  });

  return {
    formType,
    submitDisabled,
    ...commentData,
  };
};

export default connect(mapStateToProps)(CommentForm);
