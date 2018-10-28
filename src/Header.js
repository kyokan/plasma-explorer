import './Header.css';
import React, { Component } from 'react';
import bemify from './bemify';
import { connect } from 'react-redux';
import logo from './logo.svg';
const bem = bemify('header');

export class Header extends Component {
  render() {
    return (
      <div className={bem()}>
          <a href="https://kyokan.io" className={bem('logo')}>
            <img src={logo} alt="Kyokan" />
          </a>
        <div className={bem('info')}>
          {this.renderText()}
        </div>
      </div>
    );
  }

  renderText() {
    if (!this.props.blockHeight) {
      return (
        <React.Fragment>
          Plasma Block Explorer
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        Plasma Block Explorer &bull; Block Height: {this.props.blockHeight}
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    blockHeight: state.blockHeight
  };
}

export default connect(mapStateToProps)(Header)