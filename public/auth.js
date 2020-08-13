function signIn() {
    if (firebase.auth().currentUser == null) {
        togglepsi();
    } else {
        firebase.auth().signOut();
        $('#signin').text("Sign In");
        console.log("Signing out...");
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

    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        firebase.auth().onAuthStateChanged(function (user) {
            // display("email");
            pageLoad(true);
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
                        }).then(function () {
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
                    });

                    // togglepsi();
                    pageLoad(true);
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
        alert("There is already a user signed in, please sign out before proceeding.");
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
            console.log(error);
        });

        firebase.auth().onAuthStateChanged(function (user) {
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

            // display('signup');
            pageLoad(true);
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

// Forsyth Auth Start
function forsythAuth() {
    var name = document.getElementById('forsythName').value;
    var id = document.getElementById('forsythID').value;
    var pwd = document.getElementById('forsythPassword').value;

    var email = id + "@forsythk12.org";

    if (id && pwd) {
        users.doc(id).get().then(function (doc) {
            if (doc.exists && doc.data().email == email) {
                firebase.auth().signInWithEmailAndPassword(email, pwd).then(function () {
                    console.log("Success!");
                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                firebase.auth().createUserWithEmailAndPassword(email, id).then(function () {
                    firebase.auth().signInWithEmailAndPassword(email, id).catch(function (error) {
                        console.log("Error occurred signing in: ", error);
                    });

                    firebase.auth().onAuthStateChanged(function (user) {
                        users.doc(id).set({
                            email: email,
                            id: id
                        }, { merge: true }).then(function () {
                            console.log("Document successfully written!");
                        }).catch(function (error) {
                            console.error("Error writing document: ", error);
                        });

                        user.updateProfile({
                            displayName: name
                        }).then(function () {
                            console.log(user.displayName);
                        }).catch(function (error) {
                            console.log(error);
                            console.log(user.displayName);
                        });
                    });
                }).catch(function (err) {
                    if (err.code == "auth/email-already-in-use") {
                        alert("An interesting error occurred that will require developer action. Developers have been notified of this error, please try again later.");
                    }
                    console.error("Error occurred creating user: ", err);
                });
            }

            // display('forsythAuth');
            pageLoad(true);
        }).catch(function (err) {
            console.error("Error occurred getting user doc: ", err);
        });
    } else {
        if (email) {
            alert("Error occurred, please retry the authentication process.");
            console.log("Error occurred, ID somehow did not combine well with the Forsyth Email Domain string?");
        } else if (id) {
            alert("Please enter an email!");
            console.log("Error occurred, no email entered.");
        } else {
            alert("Impossible error. If you are seeing this, go email the NSA to apply for a job.");
            console.log("Impossible error.");
        }
    }
};
function forsythConnect() {
    if (user) {
        var id = document.getElementById('forsythID').value;

        var forsythUserDoc = users.doc(id);
        var siteUserDoc = users.doc(users.displayName);

        forsythUserDoc.get().then(function (doc) {
            if (!doc.exists) {
                if (confirm("You don't have an account registered with your Forsyth credentials yet! Would you like to register now?")) {
                    siteUserDoc.get().then(function (doc) {
                        doc.set({
                            id: id
                        }, { merge: true });
                    });
                } else {
                    alert("Please create an account on Discord using !signup and then come back to retry the connect process!");
                }
            } else {
                var forsythUserData = doc.data();
                if (forsythUserData.email != user.email && forsythUserData.email) {

                }
                siteUserDoc.get().then(function (doc) {
                    doc.set(forsythUserData, { merge: true });
                    forsythUserDoc.delete();
                }).then(function () {
                    alert('Successfully merged your accounts!');

                    display('forsythConnect');
                    pageLoad(true);
                }).catch(function (error) {
                    console.error("Error writing document: ", error);
                });
            }
        });
    } else {
        alert("Oh no! It looks like you're not signed in but somehow seeing this! That shouldn't be happening! Sign in and try again!");
    }
};
// Forsyth Auth End

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