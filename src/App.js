import React, { Component } from 'react';
import './App.css';
import TwoPanes from './TwoPanes';
import Blocks from './Blocks';
import BlockInfo from './BlockInfo';
import { connect, Provider } from 'react-redux';
import store from './store';
import { populateChain } from './store/blockchain';
import logo from './logo.svg';
import loading from './loading.svg';

class Inner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialLoad: true
    }
  }

  async componentDidMount() {
    await this.props.populateChain();
    this.setState({
      initialLoad: false
    });
  }

  render() {
    return (
      <div className="app">
        <a href="https://kyokan.io" className="app__logo">
          <img src={logo} alt="Kyokan" />
        </a>
        {this.renderLoading()}
      </div>
    );
  }

  renderLoading() {
    if (!this.state.initialLoad) {
      return (
        <div className="app__content">
          <TwoPanes>
            <Blocks />
            <BlockInfo />
          </TwoPanes>
        </div>
      );
    }

    return (
      <div className="app__loading">
        <img src={loading} alt="loading" />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    populateChain: () => dispatch(populateChain()),
  }
}

const WrappedInner = connect(mapStateToProps, mapDispatchToProps)(Inner);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <WrappedInner />
      </Provider>
    );
  }
}

export default App;
