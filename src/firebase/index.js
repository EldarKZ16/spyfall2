import firebase from "firebase";
let config = {
  apiKey: "AIzaSyCirrGU0L-mKLIR5-BIQtKvDfmfJ5I2iN0",
  authDomain: "spyfall-f9afb.firebaseapp.com",
  databaseURL: "https://spyfall-f9afb.firebaseio.com",
  projectId: "spyfall-f9afb",
  storageBucket: "spyfall-f9afb.appspot.com",
  messagingSenderId: "276212033937"
};
const frb = firebase.initializeApp(config);
export let firebaseDB = frb.database();
