import Api from "./api.js";
const api = new Api();

//bien global
let productList = [];
let carts = [];

// lay so luong sp
const getListCart = () => {
    const dataCarts = localStorage.getItem("carts");
    if (dataCarts) {
        carts = JSON.parse(dataCarts);
    }
    updateCartCount();
};
getListCart();

// render sp ra giao dien
const renderUI = (data) => {
    let content = "";
    data.forEach((product, index) => {
        content += `
        <div class="product-item" data-type="${product.type}">
                <img src="${product.img}" alt="${product.name}">

                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="desc">${product.desc}</p>

                    <ul class="spec">
                        <li> Screen: ${product.screen}</li>
                        <li> Back: ${product.backCamera}</li>
                        <li> Front: ${product.frontCamera}</li>
                    </ul>

                    <span class="price">${product.price}</span>
                </div>

                <button 
                class="bg-black text-white px-5 py-2 rounded hover:bg-gray-800" 
                onclick ="addToCard(${product.id}, '${product.name}','${product.img}','${product.price}')">
                Add to cart
                </button>
            </div>
        `
    });
    document.getElementById("productList").innerHTML = content;
};

// add to cart
window.addToCard = (id, name, img, price) => {
    const productAddToCart = {
        id: id,
        name: name,
        img: img,
        price: price,
        qty: 1,
    };

    const index = carts.findIndex(item => item.id === id);

    if (index !== -1) {
        carts[index].qty += 1;
    } else {
        carts.push(productAddToCart);
    }
    // storage cart to localstorage
    localStorage.setItem("carts", JSON.stringify(carts));
    
    renderCart();
    updateCartCount();
}

// render san pham da chon vao gio hang
const renderCart = () => {
    const cartBody = document.getElementById("cartBody");
    const totalAmount = document.getElementById("totalAmount");

    let content = "";
    let total = 0;

    carts.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        content += `
           <tr class="border-b">
                <td class="py-2">${item.name}</td>
                <td>$${item.price}</td>
                <td>
                    <div class="flex justify-center items-center gap-2">
                        <button 
                            onclick="changeQty('${item.id}', false)"
                            class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                            -
                        </button>

                        <span>${item.qty}</span>

                        <button 
                            onclick="changeQty('${item.id}', true)"
                            class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                            +
                        </button>
                    </div>
                </td>

                <td>$${itemTotal}</td>
                <td>
                    <button 
                        onclick="removeCartItem(${index})"
                        class="text-red-500 hover:text-red-700">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    });

    cartBody.innerHTML = content;
    totalAmount.innerText = total;
};
renderCart();


// thay doi so luong khi click - , +
window.changeQty = (id, isIncrease) => {
    const index = carts.findIndex(item => item.id == id);

    if (index !== -1) {
        if (isIncrease) {
            carts[index].qty += 1;
        }
        else {
            if (carts[index].qty > 1) {
                carts[index].qty -= 1;
            }
            else {
                carts.splice(index, 1);
            }
        }
        localStorage.setItem("carts", JSON.stringify(carts));

        renderCart();
        updateCartCount();
    }
}

// lay danh sach sp
const getListProducts = () => {
    api
        .fetchProductsApi()
        .then((result) => {
            productList = result.data;
            renderUI(productList);
        })
        .catch((error) => {
            console.log("errot", error);
        })
};
getListProducts();

// loc sp 
const filterProducts = () => {
    // lay gia tri duoc chon
    const typeFilter = document.getElementById("phoneType");

    // bat su kien khi nguoi dung doi lua chon
    typeFilter.addEventListener("change", () => {
        const selectType = typeFilter.value;

        if (selectType === "") {
            renderUI(productList);
            return;
        }

        const result = productList.filter(products => {
            return products.type === selectType;
        });
        renderUI(result);
    });
};
filterProducts();

// ham cap nhat so luong tren gio hang
function updateCartCount() {

    const badge = document.getElementById("items_number");

    // tong so luong sp
    const totalQty = carts.reduce((total, item) => {
        return total + item.qty;
    }, 0);

    badge.innerText = totalQty;
}

// xoa sp
window.removeCartItem = (index) => {
    carts.splice(index, 1);

    localStorage.setItem("carts", JSON.stringify(carts));

    renderCart();
    updateCartCount();
};

window.checkOut = () => {
    if(carts.length === 0) {
        alert("Giỏ hàng đang trống");
        return;
    }
    carts = [];

    localStorage.setItem("carts", JSON.stringify(carts));

    renderCart();
    updateCartCount();

    alert("Thanh toán thành công!");
};