import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {
  invokeApig,
  s3Upload,
} from '../libs/awsLib';
import config from '../config.js';
import LoaderButton from '../components/LoaderButton';

class Widgets extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      widget: null,
      content: '',
    };
  }

  async componentDidMount() {
    try {
      const widget = await this.getWidget();

      this.setState({
        widget,
        content: widget.content,
      });
    }
    catch(e) {
      console.error(e);
    }
  }

  getWidget() {
    return invokeApig({
      path: `/${this.props.match.params.id}`,
    }, this.props.userToken);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.length < 50
      ? str
      : `${str.substr(0, 20)}...${str.substr(str.length - 20, str.length)}`;
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.id]: target.value,
    });
  }

  handleFileChange = ({ target }) => {
    this.file = target.files[0];
  }

  saveNote(widget) {
    return invokeApig({
      path: `/${this.props.match.params.id}`,
      method: 'put',
      body: widget,
    }, this.props.userToken);
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      console.error('Please pick a file smaller than 5MB');

      return;
    }

    this.setState({
      isLoading: true,
    });

    try {
      await this.saveNote({
        ...this.state.note,
        content: this.state.content,
        attachment: this.file ? (await s3Upload(this.file, this.props.userToken)).Location : this.state.widget.attachment,
      });

      this.props.history.push('/');
    }
    catch(e) {
      console.error(e);

      this.setState({
        isLoading: false,
      });
    }
  }

  deleteNote() {
    return invokeApig({
      path: `/${this.props.match.params.id}`,
      method: 'delete',
    }, this.props.userToken);
  }

  handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this note?');

    if (!confirmed) {
      return;
    }

    this.setState({
      isDeleting: true,
    });

    try {
      await this.deleteNote();

      this.props.history.push('/');
    }
    catch(e) {
      console.error(e);

      this.setState({
        isDeleting: false,
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.widget && (
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="content">Content</label>

            <input
              id="content"
              name="content"
              onChange={this.handleChange}
              value={this.state.content}
            />

            {this.state.widget.attachment && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={this.state.widget.attachment}
              >
                {this.formatFilename(this.state.widget.attachment)}
              </a>
            )}

            {!this.state.widget.attachment && (
              <label key={1}>Attachment</label>
            )}

            <input
              key={2}
              id="file"
              name="file"
              type="file"
              onChange={this.handleFileChange}
            />

            <LoaderButton
              type="submit"
              disabled={!this.validateForm()}
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />

            <LoaderButton
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>
        )}
      </div>
    );
  }
}

export default withRouter(Widgets);

