import './BlockInfo.css';
import React, { Component } from 'react';
import bemify from './bemify';
import Transaction from './Transaction';
import { connect } from 'react-redux';
const bem = bemify('block-info');

export class BlockInfo extends Component {
  render() {
    if (!this.props.block) {
      return null;
    }

    return (
      <div className={bem()}>
        <table className={bem('header')}>
          <tbody>
            <tr>
              <td>Block Hash</td>
              <td className="mono">{this.props.block.hash}</td>
            </tr>
            <tr>
              <td>Merkle Root</td>
              <td className="mono">{this.props.block.header.merkleRoot}</td>
            </tr>
            <tr>
              <td>Previous Hash</td>
              <td className="mono">{this.props.block.header.prevHash}</td>
            </tr>
            <tr>
              <td>RLP Merkle Root</td>
              <td  className="mono">{this.props.block.header.rlpMerkleRoot}</td>
            </tr>
          </tbody>
        </table>

        <h2 className={bem('tx-header')}>Transactions</h2>

        <Transaction transactions={this.props.block.transactions} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    block: state.blockCache[state.selectedBlock]
  };
}

export default connect(mapStateToProps)(BlockInfo);