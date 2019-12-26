var Products = db.collection("products");
var cart = db.collection("cart").doc(user.displayName);


function view(productid) {
    var productReference = Products.doc(productid);

    productReference.onSnapshot(function (doc) {
        var views = doc.data().views;
        var rating = doc.data().rating;
        var price = doc.data().price;
        var productid = doc.data().id.toString();
        log("Views: ", views, " Rating: ", rating, " Price: ", price);
    });

    var newViews = {
        views: firebase.firestore.FieldValue.increment(1)
    };

    return productReference.update(newViews).then(function () {
        log("Document successfully updated!");
        productReference.onSnapshot(function (doc) {
            var views = doc.data().views;
            var productid = doc.data().id.toString();
            log(views);
            productRedirect(productid);
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
            var productid = doc.data().id.toString();
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

function productRedirect(id) {
    // var urlParams = new URLSearchParams(window.location.search);
    // var mode = urlParams.get('mode').toString();

    window.location = "product.html" + id.toString();
};

function addToCart(productid) {
    cart.update({
        items: firebase.firestore.FieldValue.arrayUnion(productid),
        itemCnt: firebase.firestore.FieldValue.increment(1),
    });
};

function removeFromCart(productid) {
    
};

function rate(productid, val) {
    Products.doc(productid).update({
        ratings: firebase.firestore.FieldValue.arrayUnion(val)
    }).then(function(doc){
        var ratings = doc.data().ratings;

        var sum = 0;
        for (var i = 0; i < grades.length; i++) {
            total += grades[i];
        }
        var rating = sum / grades.length;
        console.log(rating);
    });
};

function checkOut() {
    cart.update({
        itemCnt: 0,
        price: 0
    });
};