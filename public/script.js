firebase.initializeApp({
    apiKey: "AIzaSyBVT22t-x2H76119AHG8SgPU0_A0U-N1uA",
    authDomain: "my-scrap-project.firebaseapp.com",
    databaseURL: "https://my-scrap-project.firebaseio.com",
    projectId: "my-scrap-project",
    storageBucket: "my-scrap-project.appspot.com",
    messagingSenderId: "334998588870",
    appId: "1:334998588870:web:6b218e9655ade3a6c536c7",
    measurementId: "G-66W8QQ9W35"
});

var db = firebase.firestore();
db.enablePersistence();

var messaging = firebase.messaging();
messaging.requestPermission().then(function () {
    
}).catch(function (err) {
    alert("Error occured.")
})

var users = db.collection("users");
var emails = db.collection("emails");
var Products = db.collection("products");
var ShoppingCart = db.collection("cart");

window.onload = function () {
    document.addEventListener('keydown', function (event) {
        const key = event.key;
        if (key == "Enter" && document.getElementById('search').value.toString().toLowerCase() != "") {
            search();
        }
    });
};

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        pageLoad(true);
    } else {
        console.log("Signed out");
        pageLoad(false);
    }
});

function pageLoad(u) {
    if (u == true) {
        var usersUser = users.doc(firebase.auth().currentUser.uid);
        var emailsUser = emails.doc(firebase.auth().currentUser.displayName);
        var userCart = ShoppingCart.doc(firebase.auth().currentUser.displayName);

        if (window.location.href.includes("products.html")) {
            var urlParams = new URLSearchParams(window.location.search);
            var query = urlParams.get('query');
            results(query.toString());
        } else if (window.location.href.includes("cart.html")) {
            document.getElementById("cartItems").innerHTML = "";
            document.getElementById("totalPrice").innerHTML = "Total Price: $0.00";
            showCart();
        } else if (window.location.href.includes("c2c.html")) {
            c2cStart(true, usersUser);
        } else {
            console.log("index.html?");
        }
    } else {
        if (window.location.href.includes("products.html")) {
            var urlParams = new URLSearchParams(window.location.search);
            var query = urlParams.get('query');
            results(query.toString());
        } else if (window.location.href.includes("cart.html")) {
            document.getElementById("cartItems").innerHTML = "";
            document.getElementById("totalPrice").innerHTML = "Total Price: $0.00";
            showCart();
        } else if (window.location.href.includes("c2c.html")) {
            c2cStart(false);
        } else {
            console.log("index.html?");
        }
    }
};

function search() {
    var search = document.getElementById("search");
    var text = search.value.toString().toLowerCase();
    if (text == "") {
        display('search');
    } else {
        window.location = "products.html?query=" + text.toString();
    }
};

function redirect(pagePath) {
    window.location.replace(pagePath);
};

function display(elem) {
    $('#' + elem).toggle();
};

function togglepsi() {
    if (document.getElementById('popupsignin').style.display == "none") {
        $('#popupsignin').show();
        $("#popupsignin").animate({
            top: '0.015%',
        });
        $('#popupsignin').css({
            'background-color': 'rgba(0,0,0,0.5)'
        });
    } else {
        $("#popupsignin").animate({
            top: '-150%',
        });
        $('#popupsignin').css({
            'background-color': 'rgba(0,0,0,0)'
        });
        setTimeout(function () {
            $('#popupsignin').hide();
        }, 360);
    }
};

// Messaging, move to a different file later
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