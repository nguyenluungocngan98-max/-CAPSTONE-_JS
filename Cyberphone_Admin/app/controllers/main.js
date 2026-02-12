import Api from "./../services/api.js";
import Product from "../models/product.js";
import Validation from "../models/validation.js"; 

const api = new Api();
const validation = new Validation();

// Biến global lưu danh sách sản phẩm
let productList = [];



window.searchProduct = function() {
  const keyword = document.getElementById("searchInput").value.toLowerCase().trim();
  
  if (keyword === "") {
    renderUI(productList);
    return;
  }
  
  const filteredProducts = productList.filter(product => 
    product.name.toLowerCase().includes(keyword)
  );
  
  if (filteredProducts.length === 0) {
    document.getElementById("tblDanhSachSP").innerHTML = `
      <tr>
        <td colspan="10" class="text-center">Không tìm thấy sản phẩm nào!</td>
      </tr>
    `;
  } else {
    renderUI(filteredProducts);
  }
};



// Sắp xếp giá từ thấp đến cao
window.sortPriceAsc = function() {
  const sortedProducts = [...productList].sort((a, b) => {
    return parseFloat(a.price) - parseFloat(b.price);
  });
  renderUI(sortedProducts);
};

// Sắp xếp giá từ cao đến thấp
window.sortPriceDesc = function() {
  const sortedProducts = [...productList].sort((a, b) => {
    return parseFloat(b.price) - parseFloat(a.price);
  });
  renderUI(sortedProducts);
};



// Hiển thị lại danh sách ban đầu
window.resetSort = function() {
  renderUI(productList);
};

const renderUI = (data) => {
  let content = "";

  data.forEach((product, index) => {
    content += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.screen}</td>
                <td>${product.backCamera}</td>
                <td>${product.frontCamera}</td>
                <td><a href="${product.img}" target="_blank">Xem ảnh</a></td>
                <td>${product.desc}</td>
                <td>${product.type}</td>
                <td>
                    <button class="btn btn-danger" onclick="handleDeleteProduct(${product.id})">Delete</button>
                    <button class="btn btn-info" data-toggle="modal" data-target="#myModal" onclick="handleEditProduct(${product.id})">Edit</button>
                </td>
            </tr>
        `;
  });

  document.getElementById("tblDanhSachSP").innerHTML = content;
};

const getListProducts = () => {
  document.getElementById("loader").style.display = "block";

  const promise = api.fetchProductsApi();

  promise
    .then((result) => {
      console.log(result.data);
      productList = result.data; // LƯU danh sách sản phẩm
      renderUI(result.data);
      document.getElementById("loader").style.display = "none";
    })
    .catch((error) => {
      console.log(error);
      document.getElementById("loader").style.display = "none";
    });
};

getListProducts();

const handleDeleteProduct = (id) => {
  const promise = api.deleteProductByIdApi(id);
  promise
    .then((rs) => {
      alert(`Delete product ${rs.data.name} successfully`);
      getListProducts();
    })
    .catch((error) => {
      console.log(error);
    });
};

window.handleDeleteProduct = handleDeleteProduct;

document.getElementById("btnThemSP").onclick = function () {
  const title = "Thêm sản phẩm";
  document.getElementsByClassName("modal-title")[0].innerHTML = title;

  const footer = `
    <button class="btn btn-success" onclick="handleAddProduct()">Add Product</button>
  `;
  document.getElementsByClassName("modal-footer")[0].innerHTML = footer;
};

const handleAddProduct = () => {
  // Lấy thông tin người dùng nhập từ form
  const id = document.getElementById("ID").value;
  const name = document.getElementById("TenSP").value;
  const price = document.getElementById("GiaSP").value;
  const screen = document.getElementById("ScreenSP").value;
  const backcamera = document.getElementById("BackCameraSP").value;
  const frontcamera = document.getElementById("FrontCameraSP").value;
  const img = document.getElementById("HinhSP").value;
  const type = document.getElementById("TypeSP").value;
  const desc = document.getElementById("MoTa").value;
  // DEBUG: Kiểm tra dữ liệu
  

  // Kiểm tra validation
  let isValid = true;
  
  // Kiểm tra rỗng
  isValid &= validation.checkEmpty(id, "invalidID", "Mã sản phẩm không được để trống");
  isValid &= validation.checkEmpty(name, "invalidTenSP", "Tên sản phẩm không được để trống");
  isValid &= validation.checkEmpty(price, "invalidGiaSP", "Giá sản phẩm không được để trống");
  isValid &= validation.checkEmpty(screen, "invalidScreenSP", "Màn hình sản phẩm không được để trống");
  isValid &= validation.checkEmpty(backcamera, "invalidBackCameraSP", "Cam sau sản phẩm không được để trống");
  isValid &= validation.checkEmpty(frontcamera, "invalidFrontCameraSP", "Cam trước sản phẩm không được để trống");
  isValid &= validation.checkEmpty(img, "invalidHinhSP", "Hinh sản phẩm không được để trống");
  isValid &= validation.checkEmpty(type, "invalidTypeSP", "Loại sản phẩm không được để trống");
  isValid &= validation.checkEmpty(desc, "invalidMoTa", "Mô tả sản phẩm không được để trống");

  //Kiểm tra tồn tại
  isValid &= validation.checkIdExist(id, "invalidID", "Mã sản phẩm đã tồn tại!", productList);
  //Kiêm tra kí tự

  isValid &= validation.checkLengthCharacter(
      name,
      "invalidTenSP",
      "Tên món từ 4-50 ký tự",
      4,
      50
    );
  isValid &= validation.checkLengthCharacter(
      desc,
      "invalidMoTa",
      "Tên món từ 10-50 ký tự",
      10,
      50
    );




  // Nếu validation không hợp lệ thì DỪNG
  if (!isValid) {
    return;
  }

  // Tạo ra đối tượng product - QUAN TRỌNG: phải truyền id vào
  const product = new Product(id, name, price, screen, backcamera, frontcamera, img, type, desc);

  const promise = api.addProductApi(product);
  promise
    .then((rs) => {
      alert(`Add product ${rs.data.name} successfully`);
      getListProducts();
      document.getElementsByClassName("close")[0].click();
    })
    .catch((error) => {
      console.log(error);
    });
};

window.handleAddProduct = handleAddProduct;

const handleEditProduct = (id) => {
  const title = "Sửa sản phẩm";
  document.getElementsByClassName("modal-title")[0].innerHTML = title;
  
  const footer = `
    <button class="btn btn-success" onclick="handleUpdateProduct(${id})">Update Product</button>
  `;
  document.getElementsByClassName("modal-footer")[0].innerHTML = footer;

  const promise = api.getProductByIdApi(id);
  promise
    .then((result) => {
      const product = result.data;
      document.getElementById("TenSP").value = product.name;
      document.getElementById("GiaSP").value = product.price;
      document.getElementById("HinhSP").value = product.imageUrl;
      document.getElementById("MoTa").value = product.description;
    })
    .catch((error) => {
      console.log(error);
    });
};

window.handleEditProduct = handleEditProduct;

const handleUpdateProduct = (id) => {
  const name = document.getElementById("TenSP").value;
  const price = document.getElementById("GiaSP").value;
  const imageUrl = document.getElementById("HinhSP").value;
  const description = document.getElementById("MoTa").value;

  const product = new Product(id, name, price, imageUrl, description);

  const promise = api.updateProductByIdApi(product);
  promise
    .then((rs) => {
      alert(`Update product ${rs.data.name} successfully`);
      getListProducts();
      document.getElementsByClassName("close")[0].click();
    })
    .catch((error) => {
      console.log(error);
    });
};

window.handleUpdateProduct = handleUpdateProduct;




