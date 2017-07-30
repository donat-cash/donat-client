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
      pages: [],
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

    try {
      const pages = await this.pages();

      this.setState({
        pages,
      });
    }
    catch(e) {
      console.error(e);
    }

    this.setState({
      isLoading: false,
    });
  }

  pages() {
    return invokeApig({
      path: '/pages',
    }, this.props.userToken);
  }

  widgets() {
    return invokeApig({
      path: '/widgets',
    }, this.props.userToken);
  }

  renderPagesList(pages) {
    return pages.map((page) => (
      <li key={page.pageId}>
        <Link to={`/pages/${page.pageId}`}>
          {page.name}
        </Link>
        <Link to={`/page/${page.pageId}`}>
          Public link
        </Link>
      </li>
    ));
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

  renderPages() {
    return (
      <div key={1}>
        <h1>Your Pages</h1>
        <Link to="/pages/new">
          Create a new page
        </Link>
        <ul>
          {!this.state.isLoading && this.renderPagesList(this.state.pages)}
        </ul>
      </div>
    );
  }

  renderWidgets() {
    return (
      <div key={2}>
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
            : [
              this.renderPages(),
              this.renderWidgets(),
            ]
        }
      </div>
    );
  }
}

export default withRouter(Home);

