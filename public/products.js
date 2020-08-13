"use strict";

const txtElements = ["name", "description", "price", "rating", "saleType", "deliveryDate", "deliveryLocation"];
const txtNames = ["Name", "Description", "Price", "Rating", "Sale Type", "Delivery Date", "Delivery Location"];
const actionElements = ["addtocart", "checkout"];
const actionNames = ["Add to Cart", "Fast Checkout"];

var allLoaded = false;
var productCache = [];

function addFilter(filter) {
    

    switch (filter) {
        
    }
}

// Check if field is exactly equal to comparisonValue
function filterWithMatch(field, comparisonValue, reset = true) {
    if (reset) {
        document.getElementById("products").innerHTML = "";
    }

    if (allLoaded) {

    } else {
        Products.where(field, "==", comparisonValue).get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                showProducts(doc.data(), doc.id);
            });
        });
    }
}

// Check if field is in keywords
function filterWithIn(field, keywords, reset = true) {
    if (reset) {
        document.getElementById("products").innerHTML = "";
    }

    if (allLoaded) {

    } else {
        Products.where(field, "in", keywords).get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                showProducts(doc.data(), doc.id);
            });
        });
    }
}

// Check if any keyword is in the keywords array for the product
function filterWithKeywords(keywords, reset = true) {
    if (reset) {
        document.getElementById("products").innerHTML = "";
    }

    if (allLoaded) {

    } else {
        if (keywords.length > 10) {
            keywords = keywords.slice(0, 10);
        }

        Products.where(keywords, "array-contains-any", keywords).get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                showProducts(doc.data(), doc.id);
            });
        });
    }
};

// Check if operation on field fits comparisonValue
function filterWithAmount(field, type, operation, comparisonValue, reset = true) {
    if (reset) {
        document.getElementById("products").innerHTML = "";
    }

    if (allLoaded) {

    } else {
        switch (type) {
            case "order":
                Products.orderBy(field).get().then(function (querySnapshot) {
                    querySnapshot.forEach((doc) => {
                        showProducts(doc.data(), doc.id);
                    });
                });
                break;
            case "where":
                Products.where(field, operation, comparisonValue).get().then(function (querySnapshot) {
                    querySnapshot.forEach((doc) => {
                        showProducts(doc.data(), doc.id);
                    });
                });
                break;
        }
    }
}

function results(keystring) {
    document.getElementById("products").innerHTML = "";

    if (keystring == "product") {
        Products.orderBy("keywords").get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                showProducts(doc.data(), doc.id);
            });
        });
    } else if (keystring == ("s2s" || "teacher")) {
        Products.where("saleType", "==", keystring).orderBy("keywords").get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                showProducts(doc.data(), doc.id);
            });
        });
    } else if (keystring == ("sell" || "rent")) {
        Products.where("productType", "==", keystring).orderBy("keywords").get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                showProducts(doc.data(), doc.id);
            });
        });
    } else {
        Products.where("keywords", "array-contains-any", keystring.split(" ")).orderBy("keywords").get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                showProducts(doc.data(), doc.id);
            });
        });

        Products.where("name", "in", keystring.split(" ")).get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                showProducts(doc.data(), doc.id);
            });
        });
    }
};

function showProducts(docdata, doc) {
    var name = docdata.name;
    var imageRef = docdata.imageRef;
    var desc = docdata.description;
    var price = docdata.price;
    var deliveryDate = docdata.deliveryDate;
    var deliveryLocation = docdata.deliveryLocation;
    var saleType = docdata.saleType;
    var rentTime = docdata.rentTime;

    if (!productCache.includes(docdata) && productCache.length < 9) {
        productCache.push(docdata);

        if (productCache.length == 9) {
            allLoaded = true;
        }
    }

    Products.doc(doc).update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    var ratings = docdata.ratings;
    var sum = 0;
    for (var i = 0; i < ratings.length; i++) {
        sum += ratings[i];  
    };
    var rating = (sum / ratings.length).toFixed(1);
    
    var txtContent = [name, desc, price, rating, saleType, deliveryDate, deliveryLocation];

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
            if (rentTime) {
                elem.innerHTML = "$" + txtContent[i] + "/month for " + rentTime;
            } else {
                elem.innerHTML = "$" + txtContent[i];
            }
        } else if (txt == "rating") {
            elem.innerHTML = "<i class='fas fa-star'></i>" + txtContent[i];
        } else if (txt == "saleType") {
            var seller = docdata.seller;

            //// RASMIT! THIS CURRENTLY JUST TAKES THE ID!!!!! TURN THIS INTO THE USER!!!!!

            if (saleType == "s2s") {
                elem.innerHTML = `<img src='s2s.png' title='S2S - Sold by ${seller}'>`;
            } else if (saleType == "teacher") {
                elem.innerHTML = `<img src='https://cdn0.iconfinder.com/data/icons/back-to-school/90/school-learn-study-teacher-teaching-512.png' title='Teacher Item - Sold by ${seller}'>`;
            }
        } else if (txt == "deliveryLocation" || txt == "deliveryDate") {
            elem.innerHTML = txtNames[i] + ": " + txtContent[i];
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

        if (action == "addtocart") {
            elem.addEventListener('click', function () {
                if (user) {
                    ShoppingCart.doc(user.displayName + '/' + user.displayName + '/' + name).get().then(function (doc) {
                        if (!doc.exists) {
                            ShoppingCart.doc(user.displayName + '/' + user.displayName + '/' + name).set({
                                name: name,
                                price: price,
                                imageRef: imageRef
                            }).then(function () {
                                var atcMsg = document.querySelector('#atcMsg');
                                atcMsg.MaterialSnackbar.showSnackbar({
                                    message: 'Item added to cart',
                                    timeout: 1800,
                                    actionHandler: function () {
                                        redirect('cart.html#couter' + name);
                                    },
                                    actionText: 'Go to Cart'
                                });
                            });
                        } else {
                            var atcMsg = document.querySelector('#atcMsg');
                            atcMsg.MaterialSnackbar.showSnackbar({
                                message: 'Item already in cart',
                                timeout: 1800,
                                actionHandler: function () {
                                    redirect('cart.html#couter' + name);
                                },
                                actionText: 'See in Cart'
                            });
                        }
                    });
                } else {
                    alert('You are currently not signed in. Sign in or use fast checkout to purchase without an account.');
                }
            });
        } else {
            elem.addEventListener('click', function () {
                var name = prompt("Enter Name");
                var ccn = prompt("Enter Credit Card Number");
                var addr = prompt("Enter Shipping Address");
                alert("Product ordered! Should arrive in around " + deliveryTime + ".");
                console.log(deliveryTime);
            });
        }

        elem.classList.add("v-" + action, "mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-js-ripple-effect");
        document.getElementById(actions.id).appendChild(elem);
    };
};

function showCart() {
    document.getElementById("cartItems").innerHTML = "";
    document.getElementById("totalPrice").innerHTML = "Total Price: $0.00";
    var totalPrice = 0;
    userCart.get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
            var name = doc.data().name.toString();
            var imageRef = doc.data().imageRef.toString();
            var s2s = doc.data().s2s;
            var price = doc.data().price;
            totalPrice += price;

            var outerDiv = document.createElement("c-product");
            document.getElementById("cartItems").appendChild(outerDiv);
            outerDiv.id = "couter" + name;

            var image = document.createElement("img");
            image.src = imageRef;
            document.getElementById(outerDiv.id).appendChild(image);

            var nameEl = document.createElement("c-name");
            nameEl.className = "cname";
            nameEl.id = "cartName" + name;
            if (s2s == true) {
                var seller = doc.data().s2sauthor;
                nameEl.innerHTML = name + `<img src='s2s.png' title='S2S - Sold by ${seller}'>`;
            } else {
                nameEl.innerHTML = name;
            }
            document.getElementById(outerDiv.id).appendChild(nameEl);

            var priceEl = document.createElement("c-price");
            priceEl.className = "cprice";
            priceEl.id = "cartPrice" + price;
            priceEl.innerHTML = "$" + price;
            document.getElementById(outerDiv.id).appendChild(priceEl);

            var removeWrapper = document.createElement("c-remove");
            removeWrapper.id = "removeWrapper" + name;
            document.getElementById(outerDiv.id).appendChild(removeWrapper);

            var remove = document.createElement("div");
            remove.classList.add("remove", "mdl-button", "mdl-js-button", "mdl-button--icon", "mdl-button--colored");
            remove.id = "remove" + name;
            remove.innerHTML = " <i class='remove material-icons'>cancel</i>";
            document.getElementById(removeWrapper.id).appendChild(remove);

            remove.addEventListener('click', function () {
                userCart.doc(name).delete().then(function () {
                    document.getElementById(outerDiv.id).style.display = "none";
                    totalPrice -= price;
                    document.getElementById("totalPrice").innerHTML = "Total Price: $" + totalPrice.toFixed(2);

                    var permDelete = setTimeout(function () {
                        document.getElementById(outerDiv.id).remove();
                    }, 1800);

                    var rfcMsg = document.querySelector('#rfcMsg');
                    rfcMsg.MaterialSnackbar.showSnackbar({
                        message: 'Item removed from cart',
                        timeout: 1700,
                        actionHandler: function () {
                            userCart.doc(name).set({
                                name: name,
                                price: price,
                                imageRef: imageRef
                            });
                            totalPrice += price;
                            document.getElementById("totalPrice").innerHTML = "Total Price: $" + totalPrice.toFixed(2);
                            document.getElementById(outerDiv.id).style.display = "flex";
                            clearTimeout(permDelete);
                        },
                        actionText: 'Undo'
                    });
                });
            });
            document.getElementById("totalPrice").innerHTML = "Total Price: $" + totalPrice.toFixed(2);
        });
    });
};

function checkOut() {
    var coname = document.getElementById("coname").value;
    var coaddr = document.getElementById("coaddr").value;
    var costate = document.getElementById("costate").value;
    var cocity = document.getElementById("cocity").value;
    var cozipcode = document.getElementById("cozipcode").value;

    userCart.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {

            var name = doc.data().name;

            Products.where("name", "==", name).orderBy("keywords").get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var price = doc.data().price;
                    usersUser.update({
                        totalPrice: firebase.firestore.FieldValue.increment(price)
                    });

                    var s2s = doc.data().s2s;

                    if (s2s == true) {
                        var seller = doc.data().s2sauthor;
                        var name = doc.data().name;

                        Orders.doc(user.displayName + '/' + seller + '/' + name).set({
                            productName: name,
                            name: coname,
                            address: coaddr,
                            state: costate,
                            city: cocity,
                            zipcode: cozipcode
                        });
                    };
                });
            });
        });
    }).then(function () {
        userCart.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var name = doc.data().name;
                ShoppingCart.doc(user.displayName + '/' + user.displayName + '/' + name).delete();
            });
        });
    }).then(function () {
        display('copopup');
        alert("Product/s ordered! Each will come at their respective times, please check individual product entries for further information.");

        document.getElementById("cartItems").innerHTML = "<h1 style='text-align: center'>No items in cart! Head to the products page to buy something!</h1>";
        document.getElementById("totalPrice").innerHTML = "Total Price: $0.00";
    });
};

// function rate(val) {
//     Products.doc(productid).update({
//         ratings: firebase.firestore.FieldValue.arrayUnion(val)
//     }).then(function (doc){
//         var ratings = doc.data().ratings;
//         var sum = 0;

//         for (var i = 0; i < ratings.length; i++) {
//             sum += ratings[i];
//         };
//         var rating = sum / ratings.length;  
//         console.log(rating);
//     });
// };