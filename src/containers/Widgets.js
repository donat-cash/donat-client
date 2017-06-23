import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { invokeApig } from '../libs/awsLib';
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
      const results = await this.getWidget();
      this.setState({
        widget: results,
        content: results.content,
      });
    }
    catch(e) {
      alert(e);
    }
  }

  getWidget() {
    return invokeApig({ path: `/widgets/${this.props.match.params.id}` }, this.props.userToken);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return (str.length < 50)
      ? str
      : str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
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
  }

  handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this widget?');

    if ( ! confirmed) {
      return;
    }

    this.setState({ isDeleting: true });
  }

  render() {
    return (
      <div>
        { this.state.widget &&
          ( <form onSubmit={this.handleSubmit}>
              <label htmlFor="content">Content</label>

              <input
                id="content"
                name="content"
                onChange={this.handleChange}
                value={this.state.content}
                />

              { this.state.widget.attachment &&
              (
                  <a target="_blank" rel="noopener noreferrer" href={ this.state.widget.attachment }>
                    { this.formatFilename(this.state.widget.attachment) }
                  </a>
              )}

                { ! this.state.widget.attachment &&
                <label>Attachment</label> }
                <input
                  id="file"
                  name="file"
                  onChange={this.handleFileChange}
                  type="file" />

              <LoaderButton
                disabled={ ! this.validateForm() }
                type="submit"
                isLoading={this.state.isLoading}
                text="Save"
                loadingText="Saving…" />

              <LoaderButton
                isLoading={this.state.isDeleting}
                onClick={this.handleDelete}
                  text="Delete"
                  loadingText="Deleting…" />
            </form> )}
        </div>
      );
  }
}

export default withRouter(Widgets);
