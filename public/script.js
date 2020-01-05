firebase.initializeApp({
    apiKey: "AIzaSyBVT22t-x2H76119AHG8SgPU0_A0U-N1uA",
    authDomain: "my-scrap-project.firebaseapp.com",
    databaseURL: "https://my-scrap-project.firebaseio.com",
    projectId: "my-scrap-project",
    storageBucket: "my-scrap-project.appspot.com",
    messagingSenderId: "334998588870",
    appId: "1:334998588870:web:6b218e9655ade3a6c536c7",
    measurementId: "G-66W8QQ9W35"
});

var user = firebase.auth().currentUser;
var db = firebase.firestore();
db.enablePersistence();

window.onload = function () {
    document.getElementById("nav").innerHTML = "<!--nav begin-->
        < nav >
        < !--Beginning of Logo-- >
        <a onclick="redirect('index.html')">Logo Here</a>
        <!--End of Logo-- >& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;& nbsp;
    
        < !--Beginning of Home-- >
        <a id="home" class="navelement" onclick="redirect('index.html')">Home</a>
        <!--End of Home-- >& nbsp;& nbsp;& nbsp;
    
        < !--Beginning of Products-- >
        <a id="navproducts" class="navelement" onclick="redirect('products.html?query=product')">Products</a>
        <!--End of Products-- >& nbsp;& nbsp;& nbsp;
    
        < !--Beginning of Shopping Cart-- >
        <a id="cart" class="navelement" onclick="redirect('cart.html')">Shopping Cart</a>
        <!--End of Shopping Cart-- >& nbsp;& nbsp;& nbsp;
    
        < !--Beginning of Search-- >
        <a class="navelement">
            <i class="fas fa-search" onclick="search()"></i>
        </a> & nbsp;
    <input style="display: none;" id="search" class="navelement search" type="text" placeholder="Search">
        <!--End of Search-->&nbsp;&nbsp;&nbsp;

        <!--Beginning of Sign in button-->
        <a id="signin" class="navelement" onclick="signIn()">Sign In</a>
        <!--End of Sign in button-->
      </nav>
        <!--nav end-- >"
    if (user != null) {
        // RASMIT - INSERT THIS INTO THE SIGN IN REDIRECT STUFF, AND FIX REIRECTS TO ONLY CLOSE THE POPUP AND NOT ACTUALLY REDIRECT
        document.getElementById("signin").textContent = "Sign Out";
        console.log(user);
    } else {
        
    }
};

function search() {
    var text = document.getElementById("search").value;
    if (text == "") {
        display('search');
    } else {
        window.location = "products.html?query=" + text.toString();
    }
};

function redirect(pagePath) {
    window.location.replace(pagePath);
};