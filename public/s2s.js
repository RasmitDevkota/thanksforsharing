function s2sStart() {
    document.getElementById("s2s-verified").style.display = "none";
    document.getElementById("s2s-unverified").style.display = "none";
    document.getElementById("s2s-nouser").style.display = "none";
    if (user) {
        usersUser.get().then(function (doc) {
            if (doc.data().totalPrice >= 500) {
                console.log("s2s-verified");
                document.getElementById("s2s-verified").style.display = "flex";
                viewProducts();
            } else {
                console.log("s2s-unverified");
                document.getElementById("s2s-unverified").style.display = "flex";
            }
        });
    } else {
        console.log("no user");
        document.getElementById("s2s-nouser").style.display = "flex";
    }
};

function viewS2SProducts() {
    redirect('products.html?query=s2s');
};

function viewProducts() {
    Products.where("s2s", "==", true).where("s2sauthor", "==", user.displayName).orderBy("keywords").get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
            var name = doc.data().name;
            var description = doc.data().description;
            var price = doc.data().price;
            var imageRef = doc.data().imageRef;

            document.getElementById("s2s-verified-cards").innerHTML += `
                <div id="${name}" class="demo-card-wide mdl-card mdl-shadow--2dp s2s-content-card">
                    <div class="mdl-card__title s2s-title" style="background-image: url('${imageRef}');">
                        <h2 class="mdl-card__title-text s2s-title-text">${name}</h2>
                    </div>
                    <div class="mdl-card__supporting-text-s2s">${description}</div>
                    <div class="mdl-card__actions mdl-card--border s2s-verified-actions">
                        <a class="s2s-verified-action">
                            <i class="material-icons mdl-button mdl-js-button mdl-js-ripple-effect">edit</i>
                        </a>
                        <a class="s2s-verified-action">
                            <i class="material-icons mdl-button mdl-js-button mdl-js-ripple-effect" onclick="redirect('products.html?query=${name}')">open_in_new</i>
                        </a>
                        <a class="s2s-verified-action">
                            <i class="material-icons mdl-button mdl-js-button mdl-js-ripple-effect" onclick="removeProduct('${doc.id}')">delete</i>
                        </a>
                    </div>
                    <div class="mdl-card__menu" >
                        $${price}
                    </div>
                </div>
            `;
        });
    });
};

function removeProduct(id) {
    var c = confirm("Are you sure you want to remove this product? Once done, this action can not be reverted.");
    if (c == true) {
        $('#' + id).remove();
        Products.doc(id).delete();
    }
};

function viewOrders() {
    document.getElementById("s2s-verified-orders").innerHTML = "";

    db.collectionGroup(user.displayName).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var name = doc.data().productName;
            var buyer = doc.data().name;

            document.getElementById("s2s-verified-orders").innerHTML += `
                <div id="order-${buyer}-${name}" class="demo-card-event mdl-card mdl-shadow--2dp s2s-content-card">
                    <div class="mdl-card__title mdl-card--expand info" style="display: flex; flex-direction: column;">
                        <h5 class="info">
                            Product: ${name}<br><br>
                            Buyer: ${buyer}<br><br>
                        </h5>
                    </div>
                    <div class="mdl-card__actions mdl-card--border verifyButton">
                        <div class="mdl-layout-spacer"></div>
                        <i class="material-icons mdl-button mdl-js-button mdl-js-ripple-effect" onclick="verifyOrder('${buyer}-${name}', '${name}', '${buyer}')" style="cursor: pointer;">check</i>
                        <div class="mdl-layout-spacer"></div>
                    </div>
                </div>
            `;
        });
    });
};

function addProduct() {
    alert("Sorry, this feature is currently down right now! Check again in a few hours!");
    return;
    
    var name = document.getElementById("addname").value;
    var desc = document.getElementById("adddesc").value;
    var imageRef = document.getElementById("addImage").value;
    var rent = document.getElementById("addrent").value;
    var price = document.getElementById("addprice").value;
    var keywordsStr = document.getElementById("keywords").value;
    var keywords = keywordsStr.split(" ");
    var period = document.getElementById("addperiod").value;
    var t = document.getElementById("timestamp");
    var timestamp = t.options[t.selectedIndex].value;
    var time = rent + " " + timestamp;


    Products.doc(name).get().then(function (doc) {
        if (!doc.exists) {
            doc.set({
                name: name,
                description: desc,
                price: price,
                time: time,
                keywords: [keywords],
                ratings: [5],
                imageRef: imageRef,
                deliveryTime: "5 days",
                s2s: true,
                s2sauthor: user.displayName,
            }).then(function () {
                console.log("Document successfully written!");
            }).catch(function (error) {
                console.error("Error writing document: ", error);
            });
        } else {
            alert("This product already exists! Sorry! Maybe try renaming it?");
        }
    })
};

function verifyOrder(id, productName, buyer) {
    var c = confirm("Confirm that this product has been shipped by the seller (not necessarily received by the buyer) and that payment has been received?");
    if (c) {
        Orders.doc(buyer).collection(user.displayName).doc(productName).get().then(function (doc) {
            Orders.doc(buyer).collection(user.displayName).doc(productName).delete();
        });
        document.getElementById('order-' + id).remove();
    }
};