import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';

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

    this.setState({
      isLoading: true,
    });

    try {
      const widgets = await this.widgets();

      this.setState({
        widgets,
      });
    }
    catch(e) {
      console.error(e);
    }

    this.setState({
      isLoading: false,
    });
  }

  widgets() {
    return invokeApig({
      path: '/widgets',
    }, this.props.userToken);
  }

  renderWidgetsList(widgets) {
    return widgets.map((widget) => (
      <li key={widget.widgetId}>
        <Link to={`/widgets/${widget.widgetId}`}>
          {widget.name}
        </Link>
        <Link to={`/widget/${widget.widgetId}`}>
          Public link
        </Link>
      </li>
    ));
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
        <Link to="/widgets/new">
          Create a new widget
        </Link>
        <ul>
          {!this.state.isLoading && this.renderWidgetsList(this.state.widgets)}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        {
          this.props.userToken === null
            ? this.renderLander()
            : this.renderWidgets()
        }
      </div>
    );
  }
}

export default withRouter(Home);

