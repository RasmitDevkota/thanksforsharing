var txtElements = ["name", "description", "price", "rating", "c2c"];
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

    if (keystring == "c2c") {
        Products.where("c2c", "==", true).orderBy("keywords").get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                showProducts(doc);
            });
        });
    } else {
        Products.where("keywords", "array-contains-any", keystring.split(" ")).orderBy("keywords").get().then(function (querySnapshot) {
            querySnapshot.forEach((doc) => {
                showProducts(doc);
            });
        });
    }
};

function showProducts(doc) {
    var name = doc.data().name.toString();
    var imageRef = doc.data().imageRef.toString();
    var desc = doc.data().description.toString();
    var price = doc.data().price;
    var time = doc.data().time.toString();
    var deliveryTime = doc.data().deliveryTime.toString();
    var c2c = doc.data().c2c;

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
            elem.innerHTML = "$" + txtContent[i] + "/month for " + time;
        } else if (txt == "rating") {
            elem.innerHTML = "<i class='fas fa-star'></i>" + txtContent[i];
        } else if (txt == "c2c") {
            if (c2c == true) {
                elem.innerHTML = "<img src='c2c.png' title='C2C'>";
            } else {
                break;
            }
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
                if (user != null) {
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
    var totalPrice = 0;
    userCart.collection(user.displayName).get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
            var name = doc.data().name.toString();
            var imageRef = doc.data().imageRef.toString();
            var c2c = doc.data().c2c;
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
            if (c2c == true) {
                nameEl.innerHTML = name + "<img src='c2c.png'>";
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
                ShoppingCart.doc(user.displayName + '/' + user.displayName + '/' + name).delete().then(function () {
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
                            ShoppingCart.doc(user.displayName + '/' + user.displayName + '/' + name).set({
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
    var coaddr = document.getElementById("coname").value;
    var costate = document.getElementById("coname").value;
    var cocity = document.getElementById("coname").value;
    var coname = document.getElementById("coname").value;

    display('copopup');
    alert("Product/s ordered! Each will come at their respective times, please check individual product entries for further information");

    userCart.collection(user.displayName).get().then(function (querySnapshot) {
        var totalPrice = 0;
        querySnapshot.forEach((doc) => {
            var price = doc.data().price;
            totalPrice += price;

            var c2c = doc.data().c2c;
            if (c2c == true) {
                var seller = doc.data().c2c - author;
                var name = doc.data().name;
                
                Orders.doc(seller + '/' + user.displayName + '/' + name).set({
                    name: name
                });
            }
        }).then(function () {
            Orders.doc(seller + '/' + user.displayName + '/orderInfo').set({

            });
        }).then(function () {
            usersUser.update({
                totalPrice: firebase.firestore.FieldValue.increment(totalPrice)
            });
        });
    }).then(userCart.delete().then(function () {
        document.getElementById("cartItems").innerHTML = "<h1 style='text-align: center'>No items in cart! Head to the products page to buy something!</h1>";
        document.getElementById("totalPrice").innerHTML = "Total Price: $0.00";
    }));
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