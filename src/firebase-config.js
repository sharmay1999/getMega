// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9nPpN8V3TIdCFHpKnWjc7MfrnOKNe5rM",
  authDomain: "reactapplication-8a37b.firebaseapp.com",
  projectId: "reactapplication-8a37b",
  storageBucket: "reactapplication-8a37b.appspot.com",
  messagingSenderId: "298763635636",
  appId: "1:298763635636:web:88e90d3547c17f471ec0e1",
  measurementId: "G-QX33VXJ5GV"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = app.auth();
const db = app.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
// db.collection("data").get().then((nodes) => {
//   nodes.forEach(node => {
//     console.log('Node : ', node.data());
//   })
// })
const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
    logEvent(analytics, 'login_with_google', {
      uid: user.uid,
      name: user.displayName,
      authProvider: "google",
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const signInWithFacebook = async () => {
  try {
    const res = await auth.signInWithPopup(facebookProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
    logEvent(analytics, 'login_with_facebook', {
      uid: user.uid,
      name: user.displayName,
      authProvider: "facebook",
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    logEvent(analytics, 'login_with_email_password', {
      email: email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res.user;
    await db.collection("users").add({
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    logEvent(analytics, 'register_with_email', {
      uid: user.uid,
      name: name,
      authProvider: "local",
      email: email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  auth.signOut();
  logEvent(analytics, 'logout', {});
};
export {
  auth,
  db,
  analytics,
  signInWithGoogle,
  signInWithFacebook,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  logout
};