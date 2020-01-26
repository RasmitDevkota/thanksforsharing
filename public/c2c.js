import { messaging } from "firebase";

// General C2C
function c2cStart(u, usersUser) {
    usersUser = arguments[1] || false;
    if (u) {
        usersUser.get().then(function (doc) {
            if (doc.data().totalPrice >= 500) {
                console.log("c2c-verified");
                document.getElementById("c2c-verified").style.display = "block";

                viewProducts();
            } else {
                console.log("c2c-unverified");
                document.getElementById("c2c-unverified").style.display = "block";
            }
            console.log(doc.data().totalPrice);
        });
    } else {
        console.log("no user");
        document.getElementById("c2c-nouser").style.display = "block";
    }
};

function viewC2CProducts() {
    redirect('products.html?query=c2c');
};

// C2C Unverified
function verifyForm() {

};

function verifyInfo() {

};

function checkVerificationStatus() {

};

// C2C Verified
function viewProducts() {

};

function viewProductInPage(id) {

}

function addProduct() {

};

function removeProduct(id) {

};

function viewOrder() {

};

function confirmSale(id) {

};

function confirmShipment(id) {

};

// Messaging
messaging.usePublicVapidKey('BONZTuA0A2YLkuZGw_CejH2IaRLl6DSfr3ziXT1ARqT3jnmZcBfHfnBFllN5NshehA8wSYk2MRJWTTpyASfhtz8');

messaging.getToken().then((currentToken) => {
    if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
    } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
});

messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
        console.log('Token refreshed.');
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        setTokenSentToServer(false);
        // Send Instance ID token to app server.
        sendTokenToServer(refreshedToken);
        // ...
    }).catch((err) => {
        console.log('Unable to retrieve refreshed token ', err);
        showToken('Unable to retrieve refreshed token ', err);
    });
});