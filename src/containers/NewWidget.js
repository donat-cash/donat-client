import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import config from '../config.js';
import LoaderButton from '../components/LoaderButton';
import { invokeApig, s3Upload } from '../libs/awsLib';

class NewWidget extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      content: '',
    };
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = (event) => {
    this.file = event.target.files[0];
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isLoading: true });

    try {
      const uploadedFilename = (this.file)
        ? (await s3Upload(this.file, this.props.userToken)).Location
        : null;

      await this.createNote({
        content: this.state.content,
        attachment: uploadedFilename,
      });
      this.props.history.push('/');
    }
    catch(e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  createWidget(widget) {
    return invokeApig({
      path: '/widgets',
      method: 'POST',
      body: widget,
    }, this.props.userToken);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="content">Text</label>

        <input
          id="content"
          name="content"
          value={this.state.content}
          onChange={this.handleChange} />

        <label htmlFor="file">Attachment</label>

        <input
          id="file"
          name="file"
          type="file"
          value={this.state.file}
          onChange={this.handleFileChange} />

        <LoaderButton
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Create"
          loadingText="Creating…" />
      </form>
    );
  }
}

export default withRouter(NewWidget);
