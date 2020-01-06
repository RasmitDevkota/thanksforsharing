var Products = db.collection("products");
var ShoppingCart = db.collection("cart");

window.onload =  function () {
    if (window.location.href.includes("products.html")) {
        var urlParams = new URLSearchParams(window.location.search);
        var query = urlParams.get('query');
        results(query.toString());
    } else {
        showCart();
    }
};

var txtElements = ["name", "description", "price", "rating"];
var actionElements = ["addtocart", "checkout"];
var actionNames = ["Add to Cart", "Fast Checkout"];

function filter(field) {
    document.getElementById("products").innerHTML = "";
    Products.orderBy(field).get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
            showProducts(doc);
        });
    });
};

function results(keystring) {
    document.getElementById("products").innerHTML = "";
    Products.where("keywords", "array-contains-any", keystring.split(" ")).orderBy("keywords").get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
            showProducts(doc);
        });
    });
};

function showProducts(doc) {
    var name = doc.data().name.toString();
    var imageRef = doc.data().imageRef.toString();
    var desc = doc.data().description.toString();
    var price = doc.data().price;

    var ratings = doc.data().ratings;
    var sum = 0;
    for (var i = 0; i < ratings.length; i++) {
        sum += ratings[i];  
    };
    var rating = (sum / ratings.length).toFixed(1);
    
    var txtContent = [name, desc, price, rating];

    var outerDiv = document.createElement("v-product");
    document.getElementById("products").appendChild(outerDiv);
    outerDiv.id = "outer" + name;

    var image = document.createElement("img");
    image.src = imageRef;
    document.getElementById(outerDiv.id).appendChild(image);

    var text = document.createElement("v-text");
    text.className = "vtext";
    text.id = "productText" + name;
    document.getElementById(outerDiv.id).appendChild(text);

    for (i = 0; i < txtElements.length; i++) {
        var txt = txtElements[i];
        var elem = document.createElement("v-" + txt);
        if (txt == "price") {
            elem.innerHTML = "$" + txtContent[i] + "/month";
        } else if (txt == "rating") {
            elem.innerHTML = "<i class='fas fa-star'></i> " + txtContent[i];
        } else {
            elem.innerHTML = txtContent[i];
        }
        elem.className = "v" + txt;
        document.getElementById(text.id).appendChild(elem);
    };

    var actions = document.createElement("v-actions");
    actions.className = "vactions";
    actions.id = "productActions" + name;
    document.getElementById(outerDiv.id).appendChild(actions);

    for (i = 0; i < actionElements.length; i++) {
        var action = actionElements[i];
        var elem = document.createElement("v-" + action);
        elem.innerHTML = actionNames[i];
        if (action == "addtocart"){
            elem.addEventListener('click', function () {
                ShoppingCart.doc(firebase.auth().currentUser.displayName).set({
                    items: firebase.firestore.FieldValue.arrayUnion(name),
                    price: firebase.firestore.FieldValue.increment(price)
                }, {merge: true});
                showCart();
                console.log(price);
            });
        } else {
            elem.addEventListener('click', function () {
                console.log(action);
                prompt("Enter Credit Card Number: ");
            });
        }
        elem.classList.add("v-" + action, "mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-js-ripple-effect");
        document.getElementById(actions.id).appendChild(elem);
    };
};

function addToCart(productid) {
    Products.doc(productid).onSnapshot(function (doc) {
        var price = doc.data().price;
    });
    ShoppingCart.doc(firebase.auth().currentUser.displayName).update({
        items: firebase.firestore.FieldValue.arrayUnion(productid),
        price: firebase.firestore.FieldValue.increment(price)
    });
};

function removeFromCart(productid) {
    ShoppingCart.doc(firebase.auth().currentUser.displayName).update({
        items: firebase.firestore.FieldValue.arrayRemove(productid)
    });
};

function showCart() {
    ShoppingCart.doc(firebase.auth().currentUser.displayName).get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
            var name = doc.data().name.toString();
            var imageRef = doc.data().imageRef.toString();
            var price = doc.data().price;

            var ratings = doc.data().ratings;
            var sum = 0;
            for (var i = 0; i < ratings.length; i++) {
                sum += ratings[i];
            };
            var rating = (sum / ratings.length).toFixed(1);

            var txtContent = [name, desc, price, rating];

            var outerDiv = document.createElement("c-product");
            document.getElementById("cartItems").appendChild(outerDiv);
            outerDiv.id = "couter" + name;

            var image = document.createElement("img");
            image.src = imageRef;
            document.getElementById(outerDiv.id).appendChild(image);

            var name = document.createElement("c-name");
            name.className = "cname";
            name.id = "cartName" + name;
            document.getElementById(outerDiv.id).appendChild(name);

            var price = document.createElement("c-price");
            price.className = "cprice";
            price.id = "cartPrice" + price;
            document.getElementById(outerDiv.id).appendChild(price);

            var remove = document.createElement("c-remove");
            remove.classList.add("remove", "mdl - button", "mdl - js - button", "mdl - button--icon", "mdl - button--colored");
            remove.id = "remove" + name;
            document.getElementById(outerDiv.id).appendChild(price);
            remove.addEventListener('click', removeFromCart(name));
        });
    });
};

function rate(productid, val) {
    Products.doc(productid).update({
        ratings: firebase.firestore.FieldValue.arrayUnion(val)
    }).then(function (doc){
        var ratings = doc.data().ratings;
        var sum = 0;

        for (var i = 0; i < ratings.length; i++) {
            sum += ratings[i];
        };
        var rating = sum / ratings.length;  
        console.log(rating);
    });
};

function checkOut() {
    ShoppingCart.doc(firebase.auth().currentUser.displayName).set({
        price: 0,
        items: []
    });
};

// function fastCheckOut() {
//     var ccn = prompt("Enter Credit Card Number: ");
// };