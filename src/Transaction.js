import './Transaction.css'
import React, { Component } from 'react';
import bemify from './bemify';
const bem = bemify('transactions');

export default class Transaction extends Component {
  render() {
    return (
      <div className={bem('transaction')}>
        <table className={bem('data')}>
          <tbody>
            {this.props.transactions.map((tx, i) => (
              <React.Fragment key={tx.rootSig}>
                <tr>
                  <td colSpan="2" className={bem('tx-header')}>
                    Transaction {i}
                  </td>
                </tr>
                <tr className={bem('io-header')}>
                  <td>
                    Inputs
                  </td>
                  <td>
                    Outputs
                  </td>
                </tr>
                <tr>
                  <td className={bem('io')}>
                    {this.renderInput(tx, 0)}
                    {this.renderInput(tx, 1)}
                  </td>
                  <td className={bem('io')}>
                    {this.renderOutput(tx, 0)}
                    {this.renderOutput(tx, 1)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  renderInput(tx, idx) {
    const key = `input${idx}`;
    if (!tx[key] || !tx[key].blockNum) {
      return null;
    }
    const input = tx[key];

    return (
      <React.Fragment>
        <div className={bem('io-label')}>
          Input {idx}:
        </div>
        <table className={bem('io-table')}>
          <tbody>
            <tr>
              <th>Block Number:</th>
              <td>{input.blockNum}</td>
            </tr>
            <tr>
              <th>Output Index:</th>
              <td>{input.outIdx || 0}</td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    )
  }

  renderOutput(tx, idx) {
    const key = `output${idx}`;
    if (!tx[key]) {
      return null
    }
    const output = tx[key];

    return (
      <React.Fragment>
        <div className={bem('io-label')}>
          Output {idx}:
        </div>
        <table className={bem('io-table')}>
          <tbody>
            <tr>
              <th>To:</th>
              <td className="mono">{output.newOwner}</td>
            </tr>
            <tr>
              <th>Value:</th>
              <td>{output.amount}</td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}