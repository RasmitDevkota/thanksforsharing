// General C2C
function c2cStart() {
    if (user) {
        usersUser.get().then(function (doc) {
            if (doc.data().totalPrice >= 500) {
                console.log("c2c-verified");
                document.getElementById("c2c-verified").style.display = "flex";
                viewProducts();
            } else {
                console.log("c2c-unverified");
                document.getElementById("c2c-unverified").style.display = "flex";
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
    document.getElementById("c2c-verified-orders").innerHTML = "";

    db.collectionGroup(user.displayName).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var name = doc.data().productName;
            var buyer = doc.data().name;
            var addr = doc.data().address
            var city = doc.data().city;
            var state = doc.data().state;
            var zipcode = doc.data().zipcode;

            document.getElementById("c2c-verified-orders").innerHTML += `
                <div id="order-${buyer}-${name}" class="demo-card-event mdl-card mdl-shadow--2dp c2c-content-card">
                    <div class="mdl-card__title mdl-card--expand info" style="display: flex; flex-direction: column;">
                        <h4>
                            Product: ${name}<br>
                            Buyer: ${buyer}<br>
                        </h4>
                        <h5 id="details-${buyer}-${name}" class="details">
                            Details<br>
                            ${addr}<br>
                            ${city}, ${state} ${zipcode}<br>
                        </h5>
                    </div>
                    <div class="mdl-card__actions mdl-card--border verifyButton">
                        <div class="mdl-layout-spacer"></div>
                        <i class="material-icons mdl-button mdl-js-button mdl-js-ripple-effect" onclick="verifyOrder('${buyer}-${name}')" style="cursor: pointer;">check</i>
                        <div class="mdl-layout-spacer"></div>
                    </div>
                </div>
            `;
        });
    });
};

function addProduct() {
    var coname = document.getElementById("coname").value;
    var coaddr = document.getElementById("coaddr").value;
    var costate = document.getElementById("costate").value;
    var cocity = document.getElementById("cocity").value;
    var cozipcode = document.getElementById("cozipcode").value;
};

function verifyOrder(id) {
    var c = confirm("Confirm that this product has been shipped by the seller (not necessarily received by the buyer)?");
    if (c == true) {
        // $('#order-' + id).remove();
    }
};