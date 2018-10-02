import React from 'react';
class Charts extends React.Component {
  render() {
    return (<div>
      <h1>Charts of Accounts</h1>
      <table>

  <tr contenteditable="true">
    <th>Account Number</th>
    <th>Account Name</th>
    <th>Account Type</th>
    <th>Account Balance</th>
  </tr>
  <tr contenteditable="true">
    <td>1</td>
    <td>Cash</td>
    <td>Asset</td>
    <td>1000</td>
  </tr>

  <tr contenteditable="true">
    <td>2</td>
    <td>Rent</td>
    <td>Expense</td>
    <td>500</td>
  </tr>
  <tr contenteditable="true">
    <td>3</td>
    <td>Utilites</td>
    <td>Expense</td>
    <td>20</td>
  </tr>
  <tr contenteditable="true">
    <td>4</td>
    <td>Revenue</td>
    <td>Revenue</td>
    <td>1000</td>
  </tr>
</table>
    </div>)
  }
}
export default Charts;
