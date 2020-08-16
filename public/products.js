const txtElements = ["name", "description", "price", "rating", "saleType", "deliveryDate", "deliveryLocation"];
const txtNames = ["Name", "Description", "Price", "Rating", "Sale Type", "Delivery Date", "Delivery Location"];
const actionElements = ["addtocart", "checkout"];
const actionNames = ["Add to Cart", "Fast Checkout"];

var productCache = new Map();

function containsAny(container, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (container.includes(elements[i])) {
            return true;
        }
    }

    return false;
}

Map.prototype.where = function (field, operator, comparisonValue) {
    var results = new Map();

    switch (operator) {
        case "==":
            var operation = (k, v) => v.get(field) === comparisonValue;
            break;
        case ">=":
            var operation = (k, v) => v.get(field) >= comparisonValue;
            break;
        case "<=":
            var operation = (k, v) => v.get(field) <= comparisonValue;
            break;
        case ">":
            var operation = (k, v) => v.get(field) > comparisonValue;
            break;
        case "<":
            var operation = (k, v) => v.get(field) < comparisonValue;
            break;
        case "array-contains":
            var operation = (k, v) => v.get(field).includes(comparisonValue);
            break;
        case "in":
            var operation = (k, v) => comparisonValue.includes(v.get(field));
            break;
        case "array-contains-any":
            var operation = (k, v) => containsAny(v.get(field), comparisonValue);
            break;
    }

    for (var [k, v] of this) {
        vm = new Map();
        Object.keys(v).forEach(k => { vm.set(k, v[k]) });

        if (operation(k, vm)) {
            results.set(k, v);
        }
    }

    return results;
};

Map.prototype.order = function (field, dir = "asc") {
    const results = new Map();

    var fieldValues = [];

    this.forEach(function (value) {
        fieldValues.push(value);
    });

    fieldValues.sort(function (a, b) {
        return a.get(field) - b.get(field);
    });

    if (dir == "desc") {
        fieldValues.reverse();
    }

    for (i = 0; i < fieldValues.length; i++) {
        var data = fieldValues[i];
        var name = data.get("name")

        results.set(name, data);
    }

    console.log(results);

    return results;
};

function addFilter(filter) {
    switch (filter) {
        case "classOnly":
            var filterValue = _("filterClassOnly");
            if (filterValue) {

            } else {

            }
            break;
        default:

    }
}
        
function results(keystring) {
    document.getElementById("products").innerHTML = "";

    Products.orderBy("keywords").get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
            if (!productCache.has(doc.id) && productCache.size < querySnapshot.size) {
                console.log(productCache.size);
                productCache.set(doc.id, doc.data());
            }
        });
    }).then(function () {
        if (keystring == "product") {
            productCache.forEach((product, id) => {
                showProducts(product, id);
            });
        } else {
            productCache.where("keywords", "array-contains-any", keystring.split(" ")).forEach((product, id) => {
                showProducts(product, id);
            });
        }

        productCache.order("price");
    });
};

function showProducts(docdata, doc) {
    window.testData = docdata;

    var name = docdata.name;
    var imageRef = docdata.imageRef;
    var desc = docdata.description;
    var price = docdata.price;
    var deliveryDate = docdata.deliveryDate;
    var deliveryLocation = docdata.deliveryLocation;
    var saleType = docdata.saleType;
    var rentTime = docdata.rentTime;

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
    var coname = _("coname");
    var coaddr = _("coaddr");
    var costate = _("costate");
    var cocity = _("cocity");
    var cozipcode = _("cozipcode");

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