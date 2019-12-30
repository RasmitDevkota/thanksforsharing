var Products = db.collection("products");
var cart = db.collection("cart").doc(user.displayName);

window.onload =  function () {
    if (window.location.href.indexOf("products.html")) {

    }
}

function search() {
    var text = document.getElementById("sample6").innerHTML;
    window.location = "products.html?query=" + text.toString();
};

function showProducts(doc) {
    var name = doc.data().name.toString();
    var imageRef = doc.data().imageRef.toString();
    var desc = doc.data().description.toString();
    var productid = doc.data().id.toString();
    var rating = doc.data().ratings.toString();
    var price = doc.data().price.toString();
    var outerDiv = document.createElement("div");

    document.getElementById("results").appendChild(outerDiv);
    outerDiv.id = "outer" + name;

    var image = document.createElement("img");
    image.src = imageRef;
    document.getElementById(outerDiv.id).appendChild(image);

    var text = document.createElement("v-text");
    text.innerHTML = name;
    text.className = "vtext";
    document.getElementById(outerDiv.id).appendChild(product);

    for (i = 0; i < txtElements.length; i++) {
        var txt = txtElements[i];
        var elem = document.createElement("v-" + txt);
        elem.innerHTML = txt;
        elem.className = "v" + txt;
        document.getElementById(text.id).appendChild(elem);
    };

    var actions = document.createElement("v-actions");
    actions.className = "vactions";
    document.getElementById(outerDiv.id).appendChild(actions);

    for (i = 0; i < actionElements.length; i++) {
        var action = actionElements[i];
        var elem = document.createElement("v-" + action);
        elem.innerHTML = actionNames[i];
        elem.classList.add("v-" + action, "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect");
        document.getElementById(text.id).appendChild(elem);
    };
}

function results(keystring) {
    Products.where("keywords", "array-contains-any", keystring.split(" ")).orderBy("keywords").get().then(function (querySnapshot) {
        querySnapshot.forEach(showProducts(doc));
    });
};

var txtElements = ["name", "description", "price", "rating"];
var actionElements = ["addtocart", "checkout"];
var actionNames = ["Add to Cart", "Fast Checkout"];

function filter(field) {
    Products.orderBy(field).get().then((querySnapshot) => {
        querySnapshot.forEach(showProducts(doc));
    });
};

function productRedirect(id) {
    window.location = "product.html?" + id.toString();
};

function addToCart(productid) {
    var price = Products.doc(productid).data().price;
    cart.update({
        items: firebase.firestore.FieldValue.arrayUnion(productid),
        itemCnt: firebase.firestore.FieldValue.increment(1),
        price: firebase.firestore.FieldValue.increment(price)
    });
};

function removeFromCart(productid) {
    cart.update({
        items: firebase.firestore.FieldValue.arrayUnion(productid),
        itemCnt: firebase.firestore.FieldValue.increment(-1)
    });
};

function showCart() {
    cart.get().then(function (doc) {
        log(doc.data());
    });
};

function rate(productid, val) {
    Products.doc(productid).update({
        ratings: firebase.firestore.FieldValue.arrayUnion(val)
    }).then(function(doc){
        var ratings = doc.data().ratings;
        var sum = 0;

        for (var i = 0; i < ratings.length; i++) {
            sum += ratings[i];
        };
        var rating = sum / ratings.length;
        log(rating);
    });
};

function checkOut() {
    cart.set({
        itemCnt: 0,
        price: 0,
        items: []
    });
};