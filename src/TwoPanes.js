import './TwoPanes.css';
import React, { Component } from 'react';
import bemify from './bemify';
const bem = bemify('two-panes');

export default class TwoPanes extends Component {
  render() {
    if (React.Children.count(this.props.children) !== 2) {
      throw new Error('Must have exactly two children.');
    }

    return (
      <div className={bem()}>
        <div className={bem('left')}>
          {this.props.children[0]}
        </div>
        <div className={bem('right')}>
          {this.props.children[1]}
        </div>
      </div>
    );
  }
}