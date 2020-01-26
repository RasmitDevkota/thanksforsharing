// General C2C
function c2cStart(user) {
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
    Products.where("c2c", "==", true).where("c2c-author", "==", user.displayName).orderBy("keywords").get().then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
            console.log(doc.data());

            var name = doc.data().name;

            var outerDiv = (
                <div class="demo-card-wide mdl-card mdl-shadow--2dp c2c-content-card">
                    <div class="mdl-card__title c2c-title">
                    <h2 class="mdl-card__title-text c2c-title-text">Product</h2>
                    </div>
                    <div class="mdl-card__supporting-text-c2c">Description</div>
                    <div class="mdl-card__actions mdl-card--border c2c-verified-actions">
                        <a class="c2c-verified-action">
                            <i class="material-icons">edit</i>
                        </a>
                        <a class="c2c-verified-action">
                            <i class="material-icons">open_in_new</i>
                        </a>
                        <a class="c2c-verified-action">
                            <i class="material-icons">delete</i>
                        </a>
                    </div>
                    <div class="mdl-card__menu">
                        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">open_in_new</i>
                        </button>
                    </div>
                </div>
            );
            ReactDOM.render(myelement, document.getElementById('c2c-verified-cards'));
            $('#c2c-verified-cards').append(outerDiv);
        });
    });
};

function viewProductInPage(id) {

}

function addProduct() {

};

function removeProduct(id) {

};

function viewOrder() {

};

function confirmSale(id) {

};

function confirmShipment(id) {

};