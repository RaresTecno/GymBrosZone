// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyAe4KzYVbCwQjz2Hbve9hWZGOmRSTvX2-M",
    authDomain: "gymbroszone.firebaseapp.com",
    databaseURL: "https://gymbroszone-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gymbroszone",
    storageBucket: "gymbroszone.appspot.com",
    messagingSenderId: "628045358220",
    appId: "1:628045358220:web:2c9b8902cfada8dba507a9",
    measurementId: "G-LR3S3W8ZDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function loginGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("dentro")
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
}
export function logOut() {
    signOut(auth).then(() => {
        console.log('sesion cerrada');

    }).catch((error) => {
        console.log('Fallo al cerrar sesión');
    });
}