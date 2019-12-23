var firebase = ("firebase");

var user = firebase.auth().currentUser;
var db = firebase.firestore();
db.enablePersistence()

function redirect(pagePath) {
    if (pagePath === "signout") {
        firebase.auth().signOut();
        window.location.replace("https://www.thx4sharing.web.app");
    } else {
        //var urlParams = new URLSearchParams(window.location.search);
        //var mode = urlParams.get('mode').toString();
        //window.location = pagePath + "?mode=" + mode;
    };
};

window.onload = function () {
    //var urlParams = new URLSearchParams(window.location.search);
    //var mode = urlParams.get("darkmode");
    //if (mode == "dark") {
    //  document.getElementByTagName("html").id = "dark";
    //}
    open();
};

function toggleSignIn() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user;
            var uid = user.uid.toString();
            var db = firebase.firestore();
            var emails = db.collection("emails");
            var users = db.collection("users");

            firebase.auth().onAuthStateChanged(function (user) {
                if (user != null) {
                    var user = firebase.auth().currentUser;

                    user.providerData.forEach(function (profile) {
                        var username = profile.displayName.toString();
                        var email = profile.email.toString();
                        var userDataEmails = emails.doc(username);
                        var userDataUsers = users.doc(uid);

                        userDataEmails.get().then(function (doc) {
                            if (!doc.exists) {
                                userDataEmails.set({
                                    email: email,
                                    uid: uid,
                                }).then(function () {
                                    console.log("Document successfully written!");
                                }).catch(function (error) {
                                    console.error("Error writing document: ", error);
                                });
                            } else {
                                console.log("Emails doc already exists, skipped writing.");
                            }
                        });

                        userDataUsers.get().then(function (doc) {
                            if (!doc.exists) {
                                userDataUsers.set({
                                    displayName: username,
                                    email: email,
                                }).then(function () {
                                    console.log("Document successfully written!");
                                }).catch(function (error) {
                                    console.error("Error writing document: ", error);
                                });
                            } else {
                                console.log("Users doc already exists, skipped writing.");
                            }
                        });
                        window.location = "home.html?mode=light";
                    });
                }
            })
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different method for that email. If you want to merge your Google account with an Email/Password account, go to the Account page.');
            } else {
                console.error(error);
            }
        });
    } else {
        firebase.auth().signOut();
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user;
            var uid = user.uid.toString();
            var db = firebase.firestore();
            var emails = db.collection("emails");
            var users = db.collection("users");

            firebase.auth().onAuthStateChanged(function (user) {
                if (user != null) {
                    var user = firebase.auth().currentUser;

                    user.providerData.forEach(function (profile) {
                        var username = profile.displayName.toString();
                        var email = profile.email.toString();
                        var userDataEmails = emails.doc(username);
                        var userDataUsers = users.doc(uid);

                        userDataEmails.get().then(function (doc) {
                            if (!doc.exists) {
                                userDataEmails.set({
                                    email: email,
                                    uid: uid,
                                }).then(function () {
                                    console.log("Document successfully written!");
                                }).catch(function (error) {
                                    console.error("Error writing document: ", error);
                                });
                            } else {
                                console.log("Emails doc already exists, skipped writing.");
                            }
                        });

                        userDataUsers.get().then(function (doc) {
                            if (!doc.exists) {
                                userDataUsers.set({
                                    displayName: username,
                                    email: email,
                                }).then(function () {
                                    console.log("Document successfully written!");
                                }).catch(function (error) {
                                    console.error("Error writing document: ", error);
                                });
                            } else {
                                console.log("Users doc already exists, skipped writing.");
                            }
                        });
                        window.location = "home.html?mode=light";
                    });
                }
            })
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different method for that email. If you want to merge your Google account with an Email/Password account, go to the Account page.');
            } else {
                console.error(error);
            }
        });
    }
};
