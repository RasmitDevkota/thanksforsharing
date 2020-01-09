var users = db.collection("users");
var emails = db.collection("emails");
var ShoppingCart = db.collection("cart");

function signIn() {
    if (firebase.auth().currentUser == null){
        console.log(firebase.auth().currentUser);
        togglepsi();
    } else {
        firebase.auth().signOut();
        $('#signin').text("Sign In");
        console.log(document.getElementById("signin").innerHTML);
        console.log(firebase.auth().currentUser);
    }
    if (window.location.href.includes("cart.html") && firebase.auth().currentUser != null) { 
        showCart();
    }
};

function eToggleSignIn() {
    var password = document.getElementById('password').value;
    var email = document.getElementById('emailemail').value;
    if (email.length < 8) {
        alert('Please enter a longer email.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a longer password.');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function () {
            firebase.auth().onAuthStateChanged(function (user) {
                display("email");
                document.getElementById("signin").innerHTML = "Sign Out";
            });
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
};

// Google Login
function gToggleSignIn() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function (result) {
            var user = result.user;
            var uid = user.uid.toString();

            firebase.auth().onAuthStateChanged(function (user) {
                if (user != null) {
                    togglepsi();
                    console.log("signin");
                    document.getElementById("signin").innerHTML = "Sign Out";

                    var user = firebase.auth().currentUser;

                    console.log(user);

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
                                    console.log("Error writing document: ", error);
                                });
                            } else {
                                console.log("Users doc already exists, skipped writing.");
                            }
                        });
                    });
                };
            });
        }).catch(function (error) {
            var errorCode = error.code;
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different method for that email. If you want to merge your Google account with an Email/Password account, go to the Account page.');
            } else {
                console.log(error);
            }
        });
    } else {
        firebase.auth().signOut();
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            var user = result.user;
            var uid = user.uid.toString();
            var db = firebase.firestore();

            firebase.auth().onAuthStateChanged(function (user) {
                if (user != null) {
                    document.getElementById("signin").innerHTML = "Sign In";

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
                    });
                }
            })
        }).catch(function (error) {
            var errorCode = error.code;
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different method for that email. If you want to merge your Google account with an Email/Password account, go to the Account page.');
            } else {
                console.error(error);
            }
        });
    }
};
// Google Login End

// Signup
function handleSignUp() {
    var permusername = document.getElementById('suusername').value.toString();
    var permemail = document.getElementById('suemail').value.toString();
    var permpassword = document.getElementById('supassword').value.toString();
    
    if (permusername.length < 3) {
        alert('Please enter a longer username.');
        return;
    }
    if (permemail.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (permpassword.length < 4) {
        alert('Please enter a password.');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(permemail, permpassword).then(function () {
        
        firebase.auth().signInWithEmailAndPassword(permemail, permpassword).catch(function (error) {
            var errorMessage = error.message;
            console.log(error);
        });

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                document.getElementById("signin").innerHTML = "Sign Out";
                display('signup');

                emails.doc(permusername).set({
                    email: permemail,
                    uid: user.uid,
                }).then(function () {
                    console.log("Document successfully written!");
                }).catch(function (error) {
                    console.error("Error writing document: ", error);
                });

                users.doc(user.uid).set({
                    displayName: permusername,
                    email: permemail,
                }).then(function () {
                    console.log("Document successfully written!");
                }).catch(function (error) {
                    console.error("Error writing document: ", error);
                });

                user.updateProfile({
                    displayName: permusername,
                }).then(function () {
                    console.log(user.displayName);
                }).catch(function (error) {
                    console.log(error);
                    console.log(user.displayName);
                });
            }
        });
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
};
// Signup End

// Password Reset
function sendPasswordReset() {
    var email = document.getElementById('premail').value;
    if (email != null) {
        firebase.auth().sendPasswordResetEmail(email).then(function () {
            alert('Password Reset Email Sent!');
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/invalid-email') {
                alert(errorMessage);
            } else if (errorCode == 'auth/user-not-found') {
                alert(errorMessage);
            }
            console.log(error);
        });
    } else {
        alert("Please enter an email.");
    }
};
// Password Reset End