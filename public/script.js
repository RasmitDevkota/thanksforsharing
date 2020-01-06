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
        console.log('timeout works!');
        if (firebase.auth().currentUser != null) {
            console.log(firebase.auth().currentUser);
            document.getElementById("signin").innerHTML = "Sign Out";
        } else {
            console.log(firebase.auth().currentUser);
            signIn();
        }
    }, 950);
};

function search() {
    var text = document.getElementById("search").value.toString().toLowerCase();
    if (text == "") {

        document.getElementById('search').style.top = "24px";
        document.getElementById('search').style.zIndex = "2";

        var elem = document.getElementById("search");   
        var pos = 0;
        var id = setInterval(frame, 100);
        function frame() {
            if (pos == 100) {
                clearInterval(id);
            } else {
                
                pos++; 
                elem.style.top = pos + "px";
            }
        }*/
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