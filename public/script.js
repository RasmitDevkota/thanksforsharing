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

window.onload = function () {
    setTimeout(function () {
        if (firebase.auth().currentUser != null) {
            document.getElementById("signin").innerHTML = "Sign Out";
        } else {
            // THE LINE BELOW CREATES AUTOMATIC POPUP IF USER IS NOT SIGNED IN
            // signIn();
        }
        if (window.location.href.includes("products.html")) {
            var urlParams = new URLSearchParams(window.location.search);
            var query = urlParams.get('query');
            results(query.toString());
        } else if (window.location.href.includes("cart.html") && firebase.auth().currentUser != null) {
            showCart();
        } else {
            console.log("Index.html?");
        }
    }, 950);
    
    document.addEventListener('keydown', function (event) {
        const key = event.key;
        if (key == "Enter" && document.getElementById('search').value.toString().toLowerCase() != "") {
            search();
        }
    });
};

function search() {
    
    var text = document.getElementById("search").value.toString().toLowerCase();
    if (text == "") {
        if ("search".style.display === "none") {
            elem.style.display = "block";
        } else {
            elem.style.display = "none";
        }
    } else {
        window.location = "products.html?query=" + text.toString();
    }
};

function redirect(pagePath) {
    window.location.replace(pagePath);
    if (firebase.auth().currentUser != null) {
        document.getElementById("signin").innerHTML = "Sign Out";
    } else {
        firebase.auth().signOut();
    }
};