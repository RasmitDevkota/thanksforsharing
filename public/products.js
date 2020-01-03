var Products = db.collection("products");

window.onload =  function () {
    var urlParams = new URLSearchParams(window.location.search);

    if (window.location.href.indexOf("products.html")) {
        var query = urlParams.get('query');
        console.log(query);
        results(query.toString());
    } else if (window.location.href.indexOf("product.html")) {
        var product = urlParams.get('product').toString();

        if (user != null){
            var cart = db.collection("cart").doc(user.displayName);
        } else {
            document.getElementById('popupsignin').style.display = "block";
        }
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
    var price = doc.data().price.toString();

    var ratings = doc.data().ratings;
    var sum = 0;
    for (var i = 0; i < ratings.length; i++) {
        sum += ratings[i];  
    };
    var rating = sum / ratings.length;
    
    var txtContent = [name, desc, price, rating];

    var outerDiv = document.createElement("v-product");
    document.getElementById("products").appendChild(outerDiv);
    outerDiv.id = "outer" + name;

    var image = document.createElement("img");
    image.src = imageRef;
    document.getElementById(outerDiv.id).appendChild(image);

    var text = document.createElement("v-text");
    text.innerHTML = name;
    text.className = "vtext";
    text.id = "productText"
    document.getElementById(outerDiv.id).appendChild(text);

    for (i = 0; i < txtElements.length; i++) {
        var txt = txtElements[i];
        var elem = document.createElement("v-" + txt);
        if (txt == "price") {
            elem.innerHTML = "$" + txtContent[i];
        } else if (txt == "rating") {
            elem.innerHTML = "<i class='fas fa-star'></i> " + txtContent[i];
        } else {
            elem.innerHTML = txtContent[i];
        }
        elem.className = "v" + txt;
        document.getElementById("productText").appendChild(elem);
    };

    var actions = document.createElement("v-actions");
    actions.className = "vactions";
    document.getElementById(outerDiv.id).appendChild(actions);

    for (i = 0; i < actionElements.length; i++) {
        var action = actionElements[i];
        var elem = document.createElement("v-" + action);
        elem.innerHTML = actionNames[i];
        if (action == "addtocart")
        elem.addEventListener('click', addToCart(name));
        elem.classList.add("v-" + action, "mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-js-ripple-effect");
        document.getElementById(text.id).appendChild(elem);
    };

    document.getElementById().addEventListener('click', function (event) {
        
    });
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
        items: firebase.firestore.FieldValue.arrayRemove(productid),
        itemCnt: firebase.firestore.FieldValue.increment(-1)
    });
};

function showCart() {
    cart.get().then(function (doc) {
        console.log(doc.data());
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
        console.log(rating);
    });
};

function checkOut() {
    cart.set({
        itemCnt: 0,
        price: 0,
        items: []
    });
};