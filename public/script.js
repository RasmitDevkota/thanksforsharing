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

var users = db.collection("users");
var emails = db.collection("emails");
var Products = db.collection("products");
var ShoppingCart = db.collection("cart");
var Orders = db.collection("orders");

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
        document.getElementById("signin").innerHTML = "Sign Out";

        window.user = firebase.auth().currentUser;
        window.usersUser = users.doc(user.uid);
        window.emailsUser = emails.doc(user.displayName);
        window.userCart = ShoppingCart.doc(user.displayName).collection(user.displayName);

        if (window.location.href.includes("products.html")) {
            var urlParams = new URLSearchParams(window.location.search);
            var query = urlParams.get('query');
            if (query.includes('%20')) {
                query.replace("%20", " ");
                console.
            }
            results(query.toString());
        } else if (window.location.href.includes("cart.html")) {
            document.getElementById("cartItems").innerHTML = "<h1 style='text-align: center'>No items in cart! Go to products page and add some items to cart.</h1>";
            document.getElementById("totalPrice").innerHTML = "Total Price: $0.00";
            showCart();
        } else if (window.location.href.includes("c2c.html")) {
            if (user) {
                usersUser.get().then(function (doc) {
                    if (doc.data().totalPrice >= 500) {
                        console.log("c2c-verified");
                        document.getElementById("c2c-verified").style.display = "block";
                        viewProducts();
                    } else {
                        console.log("c2c-unverified");
                        document.getElementById("c2c-unverified").style.display = "block";
                    }
                });
            } else {
                console.log("no user");
                document.getElementById("c2c-nouser").style.display = "block";
            }
        } else {
            console.log("index.html?");
        }
    } else {
        window.user = false;

        if (window.location.href.includes("products.html")) {
            var urlParams = new URLSearchParams(window.location.search);
            var query = urlParams.get('query');
            results(query.toString());
        } else if (window.location.href.includes("cart.html")) {
            document.getElementById("cartItems").innerHTML = "<h1 style='text-align: center'>Not signed in! Sign in to use cart.<h1>";
            document.getElementById("totalPrice").innerHTML = "Total Price: $0.00";
        } else if (window.location.href.includes("c2c.html")) {
            c2cStart();
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