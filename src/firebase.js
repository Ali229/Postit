import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDa8lyXIoWUzkLkgH5I0M7flsACHuLx5PI",
  authDomain: "ledger-571aa.firebaseapp.com",
  databaseURL: "https://ledger-571aa.firebaseio.com",
  projectId: "ledger-571aa",
  storageBucket: "ledger-571aa.appspot.com",
  messagingSenderId: "33116049491"
};

export const firebaseApp = firebase.initializeApp(config);
