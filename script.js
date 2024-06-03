const buttons = document.querySelectorAll('.filterbutton');
buttons.forEach(button => {
    button.addEventListener('click', function () {
        getListProduct({ data: { "type": this.textContent } })
    });
});

var list_product = document.getElementById("list_product")
var product_detail = document.getElementById("product-detail")
var cart = document.getElementById("cart")
var cart_detail = document.getElementById("cart-detail")
var popup = document.getElementById("popup")
var listProducts = [];
var cartItems = [];
var cart_btn = document.getElementById("shopping_cart_btn")

var listItems = [
    {
        image:
            "https://nupet.vn/wp-content/uploads/2023/10/hinh-nen-ngo-nghinh-anh-meo-cute-nupet-new-5.jpg",
        price: 10000000,
        name: "Dinh Nhu Cuong",
        description: "abcccccc",
        id: 1,
        type: "service"
    },
    {
        image:
            "https://nupet.vn/wp-content/uploads/2023/10/hinh-nen-ngo-nghinh-anh-meo-cute-nupet-new-5.jpg",
        price: 10000000,
        name: "Le Hai Ha",
        description: "abcccccc",
        id: 2,
        type: "facility"
    },
    {
        image:
            "https://nupet.vn/wp-content/uploads/2023/10/hinh-nen-ngo-nghinh-anh-meo-cute-nupet-new-5.jpg",
        price: 10000000,
        name: "Nguyen Hoang Anh",
        description: "abcccccc",
        id: 3,
        type: "service"
    },
];

async function fetchDataFromAPI(url, body) {
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });
    if (response && response.status !== 200) {
        // alert('Please use F5 to refresh the page');
        throw new Error('Something wrongs with status code: ' + response.code);
    }
    let data = (await response.json()).data
    listProducts = data.items;
    return data;
}

const getListProduct = async (body) => {
    // let product = await fetchDataFromAPI('http://10.63.161.172:3000/api/get-product', body)
    // loadProducts(product)
    loadProducts(body)
}

function closePopup() {
    popup.classList.remove('active')
}

function closeCart() {
    cart.classList.remove('active')
}

function loadProducts(data) {
    console.log('data :', listItems)
    const dataText = listItems.map(item => `
    <div class="card" id="${item.id}">
    <img src="${item.image}"
    <div class="card-content">
    <h5>${item.type}</h5>
    <h5>${item.price} VND</h5>
    </div>
    </div>
    `).join("");

    list_product.innerHTML = dataText;
    listItems.forEach(item => {
        document.getElementById(item.id).addEventListener('click', function () {
            const dataText = `
    <img src="${item.image}">
    <div class="card-content">
    <h4>${item.name}</h4>
    <p>${item.description}</p>
    <h5>${item.price} VND</h5>
    <button id=${item.id} onclick="addToCart(this.id)">Add to cart</button>
    </div>
    <div class="quit" onclick="closePopup()">x</div>
    `;
            product_detail.innerHTML = dataText;
            popup.classList.add('active')
        })
    })

    // const dataText = data.items.map(item => `
    //                 <div class="card" id="${item.id}">
    //                 <img src="${item.image}"
    //                 <div class="card-content">
    //                 <h5>${item.type}</h5>
    //                 <h5>${item.price} VND</h5>
    //                 </div>
    //                 </div>
    //                 `).join("");

    // list_product.innerHTML = dataText;
    // data.items.forEach(item => {
    //     document.getElementById(item.id).addEventListener('click', function () {
    //         const dataText = `
    //                 <img src="${item.image}">
    //                 <div class="card-content">
    //                 <h4>${item.name}</h4>
    //                 <p>${item.description}</p>
    //                 <h5>${item.price} VND</h5>
    //                 <button id=${item.id} onclick="addToCart(this.id)">Add to cart</button>
    //                 </div>
    //                 <div class="quit" onclick="closePopup()">x</div>
    //                 `;
    //         product_detail.innerHTML = dataText;
    //         popup.classList.add('active')
    //     })
    // })
}

function addToCart(id) {
    // const product = cartItems.find(p => p.productId == id)
    const product = cartItems.find(p => p.productId == id)
    if (!product) {
        const currentProduct = listItems.find(p => p.id = id)
        // const currentProduct = listProducts.find(p => p.id = id)
        console.log(currentProduct.id + " : " + currentProduct.name)
        cartItems.push({ productId: currentProduct.id, productName: currentProduct.name, quantity: 1, price: currentProduct.price })
    }
    else {
        product.quantity += 1;
    }

    let totalProduct = 0;

    cartItems.forEach(item => {
        totalProduct += item.quantity;
    })

    cart_btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ${totalProduct}`;
}

function deletefromCart(id) {
    const index = cartItems.findIndex(p => p.productId == id);
    if (index !== -1) {
        cartItems.splice(index, 1);
    }

    let totalProduct = 0;

    cartItems.forEach(item => {
        totalProduct += item.quantity;
    })

    if(totalProduct != 0){
    cart_btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ${totalProduct}`;
    } else {
    cart_btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>`;
    }
    showCart()
}

function showCart() {
    console.log(cartItems)
    let total = 0;
    let dataText = ``
    cartItems.forEach(item => {
    total += item.price * item.quantity;
    dataText = dataText.concat(`<div class="cart-product-detail">
    <div class="cart_product-name_quantity">${item.productName} (${item.quantity}) </div>
    <div class="cart_product-price">${item.price} VND</div>
    <button class="btn_Delete" id=${item.productId} onclick="deletefromCart(this.id)">Delete</button>
    </div>
    `);
    })
    dataText = dataText.concat(`
    <div class="quit" onclick="closeCart()">x</div>
    <div id="total_price">Total: ${total} VND</div>
    <button id="btn_Submit" onclick="submitorder(this.id)">Submit</button>
    `);
    cart_detail.innerHTML = dataText;
    cart.classList.add('active')
}

// window.addEventListener('click', (event) => {
//     if(!cart.contains(event.target)){
//         closeCart();
//     }
// })

getListProduct({})