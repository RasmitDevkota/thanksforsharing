// General C2C
function c2cStart() {
    if (user) {
        usersUser.get().then(function (doc) {
            if (doc.data().totalPrice >= 500) {
                console.log("c2c-verified");
                document.getElementById("c2c-verified").style.display = "block";
                viewProducts();
            } else {
                console.log("c2c-unverified");
                document.getElementById("c2c-unverified").style.display = "block";
            }
        });
    } else {
        console.log("no user");
        document.getElementById("c2c-nouser").style.display = "block";
    }
};

function viewC2CProducts() {
    redirect('products.html?query=c2c');
};

// C2C Unverified
function verifyForm() {

};

function verifyInfo() {
    
};

function checkVerificationStatus() {
    usersUser.get().then(function (doc) {
        if (doc.data().totalPrice >= 500) {
            document.getElementById("c2c-verified").style.display = "block";
            viewProducts();
        }
    });
};

// C2C Verified
function viewProducts() {
    Products.where("c2c", "==", true).where("c2cauthor", "==", user.displayName).orderBy("keywords").get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
            var name = doc.data().name;
            var description = doc.data().description;
            var price = doc.data().price;
            var imageRef = doc.data().imageRef;

            document.getElementById("c2c-verified-cards").innerHTML += `
                <div id="${name}" class="demo-card-wide mdl-card mdl-shadow--2dp c2c-content-card">
                    <div class="mdl-card__title c2c-title" style="background-image: url('${imageRef}');">
                        <h2 class="mdl-card__title-text c2c-title-text">${name}</h2>
                    </div>
                    <div class="mdl-card__supporting-text-c2c">${description}</div>
                    <div class="mdl-card__actions mdl-card--border c2c-verified-actions">
                        <a class="c2c-verified-action">
                            <i class="material-icons mdl-button mdl-js-button mdl-js-ripple-effect">edit</i>
                        </a>
                        <a class="c2c-verified-action">
                            <i class="material-icons mdl-button mdl-js-button mdl-js-ripple-effect" onclick="redirect('products.html?query=${name}')">open_in_new</i>
                        </a>
                        <a class="c2c-verified-action">
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
    db.collectionGroup(user.displayName).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if (doc.id == 'orderInfo') {
                console.log("Order Info: ", doc.data());
            } else {
                document.getElementById("c2c-verified-orders").innerHTML += `
                    <div class="demo-card-event mdl-card mdl-shadow--2dp">
                        <div class="mdl-card__title mdl-card--expand" style="display: flex; flex-direction: column;">
                            <h4>
                                Product: Air Conditioner
                                Buyer: Rasmit Devkota
                                <a id="show-details" onclick="display('details'); display('show-details'); display('hide-details')">Click to view more details</a>
                                <a id="hide-details" style="display: none;" onclick="display('details'); display('show-details'); display('hide-details')">Hide</a>
                            </h4>
                            <h3 id="details" style="display: none;">
                                3325 Medinah Circle<br>
                                Cumming, Georgia 30041<br>
                            </h3>
                        </div>
                        <div class="mdl-card__actions mdl-card--border">
                            <div class="mdl-layout-spacer"></div>
                            <i class="material-icons" onclick="verifyOrder()" style="cursor: pointer;">check</i>
                            <div class="mdl-layout-spacer"></div>
                        </div>
                    </div>
                `;
            }
        });
    });
};

function addProduct() {

};

function confirmSale(id) {

};

function confirmShipment(id) {

};
