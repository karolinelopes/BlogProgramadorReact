import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyBTSSEDUQ9O875QzhdxExhv-O2_lYU9FXQ",
    authDomain: "reactapp-11750.firebaseapp.com",
    databaseURL: "https://reactapp-11750-default-rtdb.firebaseio.com",
    projectId: "reactapp-11750",
    storageBucket: "reactapp-11750.appspot.com",
    messagingSenderId: "662176384648",
    appId: "1:662176384648:web:8ba3cbebde221a6ace013d",
    measurementId: "G-SXW3F67883"
  };

class Firebase{
    constructor(){
        app.initializeApp(firebaseConfig);

        //Referenciando a database para acessar em outros locais
        this.app = app.database();

        this.storage = app.storage();
    }

    login(email, password){
        return app.auth().signInWithEmailAndPassword(email, password)
    }

    logout(){
        return app.auth().signOut();
    }

    async register(name, email, password){
        await app.auth().createUserWithEmailAndPassword(email, password)

        const uid = app.auth().currentUser.uid;

        return app.database().ref('users').child(uid).set({
            name: name
        })
    }

    isInitialized(){
        return new Promise(resolve => {
            app.auth().onAuthStateChanged(resolve);
        })
    }

    getCurrent(){
        return app.auth().currentUser && app.auth().currentUser.email
    }

    getCurrentUid(){
        return app.auth().currentUser && app.auth().currentUser.uid
    }

    async getUserName(callback){
        if(!app.auth().currentUser){
            return null;
        }

        const uid = app.auth().currentUser.uid;
        await app.database().ref('users').child(uid)
        .once('value').then(callback);
    }

}

export default new Firebase();