var Products = db.collection("products");
var ShoppingCart = db.collection("cart");

function view(productid) {
    var productReference = Products.doc(productid);

    productReference.onSnapshot(function (doc) {
        var views = doc.data().views;
        var rating = doc.data().rating;
        var price = doc.data().price;
        var productRef = doc.data().id.toString();
        log("Views: ", views, " Rating: ", rating, " Price: ", price);
    });

    var newViews = {
        views: firebase.firestore.FieldValue.increment(1)
    };

    return productReference.update(newViews).then(function () {
        log("Document successfully updated!");
        productReference.onSnapshot(function (doc) {
            var views = doc.data().views;
            var productRef = doc.data().id.toString();
            log(views);
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

    window.location = "product.html" + ref.toString();
};

function addToCart(prou) {
    
};