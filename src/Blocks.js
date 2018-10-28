import './Blocks.css';
import React, { Component } from 'react';
import bemify from './bemify';
import { connect } from 'react-redux';
import { selectBlock } from './store/blockchain';
import classnames from 'classnames';

const bem = bemify('blocks');

export class Blocks extends Component {
  render() {
    return (
      <div className={bem()}>
        {this.props.blocks.map((block) => {
          const cnames = classnames(bem('block'), {
            [bem('block', 'active')]: this.props.selectedBlock === block.header.number
          });

          return (
            <a className={cnames} key={block.hash} onClick={() => this.props.selectBlock(block.header.number)}>
              <div className={bem('number')}>
                Block #{block.header.number}
              </div>
              <div className={bem('count')}>
                Transactions: {block.transactions.length}
              </div>
            </a>
          );
        })}
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