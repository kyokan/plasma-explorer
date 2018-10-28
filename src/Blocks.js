import './Blocks.css';
import React, { Component } from 'react';
import bemify from './bemify';
import { connect } from 'react-redux';
import { selectBlock } from './store/blockchain';
import classnames from 'classnames';

const bem = bemify('blocks');

class Block extends Component {
  render() {
    const cnames = classnames(bem('block'), {
      [bem('block', 'active')]: this.props.selectedBlock === this.props.block.header.number,
    });

    return (
      <a
        className={cnames}
        key={this.props.block.hash}
        onClick={() => this.props.selectBlock(this.props.block.header.number)}
      >
        <div className={bem('number')}>
          Block #{this.props.block.header.number}
        </div>
        <div className={bem('count')}>
          Transactions: {this.props.block.transactions.length}
        </div>
      </a>
    );
  }
}

export class Blocks extends Component {
  render() {
    return (
      <div className={bem()}>
        {this.props.blocks.map((block) => <Block
          selectedBlock={this.props.selectedBlock}
          block={block}
          selectBlock={this.props.selectBlock}
        />)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedBlock: state.selectedBlock,
    blocks: state.blocks
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectBlock: (num) => dispatch(selectBlock(num))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blocks);