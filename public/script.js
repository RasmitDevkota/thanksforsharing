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

var user = firebase.auth().currentUser;
var db = firebase.firestore();
db.enablePersistence();

if(user != null) {
    document.getElementById("signin").textContent = "Sign Out";
};

function redirect(pagePath) {
    if (pagePath === "signout") {
        firebase.auth().signOut();
        window.location.replace("https://www.thx4sharing.web.app");
    } else {
        // var urlParams = new URLSearchParams(window.location.search);
        // var mode = urlParams.get('mode').toString();

        window.location = "https://www.thx4sharing.web.app/public/" + pagePath;
    };
};

window.onload = function () {
    // var urlParams = new URLSearchParams(window.location.search);
    // var mode = urlParams.get("darkmode");
    // if (mode == "dark") {
    //     document.getElementByTagName("html").id = "dark";
    // }
};

function log(text) {
    console.log(text);
};