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
    }, 950);
    if (window.location.href.includes("products.html")) {
        var urlParams = new URLSearchParams(window.location.search);
        var query = urlParams.get('query');
        results(query.toString());
    } else {
        if (firebase.auth().currentUser != null) {
            showCart();
        }
    }
    document.addEventListener('keydown', (e) => {
        if (e.code === "Enter"){
            if(document.getElementById("search").value.toString().toLowerCase() !@= ""){

            }
        }
      
      });
    // here

    document.addEventListener('keydown', function (event) {
        var password = document.getElementById('password').value;
        var username = document.getElementById('username').value;
        const key = event.key;
        if (key == "Enter") {
            toggleSignIn();
        }
    });
};

function search() {
    var text = document.getElementById("search").value.toString().toLowerCase();
    if (text == "") {
        display("search");
    } else {
        window.location = "products.html?query=" + text.toString();
    }
};

function redirect(pagePath) {
    window.location.replace(pagePath);
    console.log(firebase.auth().currentUser);
    if (firebase.auth().currentUser != null) {
        console.log(firebase.auth().currentUser);
        document.getElementById("signin").innerHTML = "Sign Out";
    } else {
        console.log(firebase.auth().currentUser);
        firebase.auth().signOut();
    }
};