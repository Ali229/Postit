import React from 'react';
class Home extends React.Component {
  // async componentDidMount() {
  //   try {
  //     console.log('here');
  //     let response = await fetch('http://markzeagler.com/ledger-backend/account/all', {
  //       method: "GET",
  //       headers: {
  //         'Authorization': 'Bearer MqMILbviXxyiB9a_BFFPgFsNY8D01KJohhdcwq74lAU',
  //         'Accept': 'application/json',
  //         'Cache-Control': 'no-cache'
  //       }
  //     });
  //     if (!response) {
  //       throw new Error('no response');
  //     }
  //     let resJSON = await response.json();
  //      if (!resJSON) {
  //        throw new Error('no respinse from resJSON');
  //      }
  //     console.log(JSON.stringify(resJSON));
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }
  render() {
    return (<div></div>)
  }
}

export default Home;
