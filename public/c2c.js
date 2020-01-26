// General C2C
function c2cStart(u, usersUser) {
    usersUser = arguments[1] || false;
    if (firebase.auth().currentUser != null) {
        usersUser.get().then(function (doc) {
            if (doc.data().totalPrice >= 500) {
                console.log("c2c-verified");
                document.getElementById("c2c-verified").style.display = "block";
            } else if (doc.data().totalPrice != null) {
                console.log("c2c-verified");
                document.getElementById("c2c-unverified").style.display = "block";
            }
            console.log(doc.data().totalPrice);
        });
    } else {
        console.log("no user");
        document.getElementById("c2c-nouser").style.display = "block";
    }
};

function viewC2CProducts() {
    window
};

// C2C Unverified
function verifyForm() {

};

function verifyInfo() {

};

function checkVerificationStatus() {

};

// C2C Verified
function viewProducts() {

};

function addProduct() {

};

function removeProduct() {

};

function viewOrder() {

};

function confirmSale() {

};

function confirmShipment() {

};