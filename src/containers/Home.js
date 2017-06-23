import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { invokeApig } from '../libs/awsLib';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      widgets: [],
    };
  }

  async componentDidMount() {
    if (this.props.userToken === null) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      const results = await this.widgets();
      this.setState({ widgets: results });
    }
    catch(e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  widgets() {
    return invokeApig({ path: '/widgets' }, this.props.userToken);
  }

  renderWidgetsList(widgets) {
    return [{}].concat(widgets).map((widget, i) => (
      i !== 0
        ? ( <a
              key={widget.widgetId}
              href={`/widgets/${widget.widgetId}`}
              onClick={this.handleWidgetClick}
              header={widget.content.trim().split('\n')[0]}>
                { "Created: " + (new Date(widget.createdAt)).toLocaleString() }
            </a> )
        : ( <a
              key="new"
              href="/widgets/new"
              onClick={this.handleWidgetClick}>
                Create a new widget
            </a> )
    ));
  }

  handleWidgetClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  renderLander() {
    return (
      <div>
        <h1>Donat</h1>
        <p>A simple widgets for donation</p>
      </div>
    );
  }

  renderWidgets() {
    return (
      <div>
        <h1>Your Widgets</h1>
        <ul>
          { ! this.state.isLoading
            && this.renderWidgetsList(this.state.widgets) }
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        { this.props.userToken === null
          ? this.renderLander()
          : this.renderWidgets() }
      </div>
    );
  }
}

export default withRouter(Home);

