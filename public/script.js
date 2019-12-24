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

var Products = db.collection("products");

function redirect(pagePath) {
    if (pagePath === "signout") {
        firebase.auth().signOut();
        window.location.replace("https://www.thx4sharing.web.app");
    } else {
        // var urlParams = new URLSearchParams(window.location.search);
        // var mode = urlParams.get('mode').toString();

        window.location = "https://www.thx4sharing.web.app/;
    };
};

window.onload = function () {
    // var urlParams = new URLSearchParams(window.location.search);
    // var mode = urlParams.get("darkmode");
    // if (mode == "dark") {
    //     document.getElementByTagName("html").id = "dark";
    // }
};

function view(productid) {
    var productReference = Products.doc(productid);

    productReference.onSnapshot(function (doc) {
        var views = doc.data().views;
        var rating = doc.data().rating;
        var price = doc.data().price;
        var productRef = doc.data().id.toString();
        console.log("Views: ", views, " Rating: ", rating, " Price: ", price);
    });

    var newViews = {
        views: firebase.firestore.FieldValue.increment(1)
    };

    return productReference.update(newViews).then(function () {
        console.log("Document successfully updated!");
        productReference.onSnapshot(function (doc) {
            var views = doc.data().views;
            var productRef = doc.data().id.toString();
            console.log(views);
            memeRedirect(productRef);
        });
    }).catch(function (error) {
        console.error("Error updating document: ", error);
    });
};

function filter(field) {
    Products.orderBy(field).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var name = doc.data().name.toString();
            var desc = doc.data().description.toString();
            var productRef = doc.data().id.toString();
            var views = doc.data().views.toString();
            var price = doc.data().price.toString();

            var outerDiv = document.createElement("div");
            document.getElementById("Results").appendChild(outerDiv);
            outerDiv.id = "outer" + name;

            var product = document.createElement("p");
            product.innerHTML = name;
            product.className = "product";
            product.onclick = function () {
                view(productRef);
            };
            document.getElementById(outerDiv.id).appendChild(product);
        });
    });
};

function productRedirect(ref) {
    // var urlParams = new URLSearchParams(window.location.search);
    // var mode = urlParams.get('mode').toString();

    window.location = "product.html"
};