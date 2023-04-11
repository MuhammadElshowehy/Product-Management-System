let productTitle = document.getElementById("product-title");
let productPrice = document.getElementById("product-price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let create = document.getElementById("create");
let deleteAll = document.getElementById("delete-all");

// 1- get total:
function getTotal() {
  if (productPrice.value != "") {
    total.innerHTML =
      +productPrice.value + +taxes.value + +ads.value - +discount.value;
    total.style.backgroundColor = "#1e6fd9";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "#94bdf2";
  }
}
productPrice.addEventListener("keyup", getTotal);
taxes.addEventListener("keyup", getTotal);
ads.addEventListener("keyup", getTotal);
discount.addEventListener("keyup", getTotal);

// 2- create products:
let allProducts;
if (localStorage.getItem("allProducts") != null) {
  allProducts = JSON.parse(localStorage.getItem("allProducts"));
  showData();
} else {
  allProducts = [];
}
// create one product:
create.addEventListener("click", function () {
  let product = {
    productTitle: productTitle.value,
    productPrice: productPrice.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value,
  };
  allProducts.push(product);
  localStorage.setItem("allProducts", JSON.stringify(allProducts));
  clearInputs();
  showData();
});

// 3- clear inputs after click create button:
function clearInputs() {
  productTitle.value = "";
  productPrice.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}
// 4- show data:
function showData() {
  // toggle show for delete all button:
  function toggleDeleteAll() {
    if (allProducts.length > 0) {
      deleteAll.style.display = "block";
    } else {
      deleteAll.style.display = "none";
    }
  }
  toggleDeleteAll();

  if (allProducts.length == 0) {
    document.getElementById("tbody").innerHTML = "";
  } else {
    let tbody = "";
    for (let i = 0; i < allProducts.length; i++) {
      tbody += `
      <tr>
        <td>${i + 1}</td>
        <td>${allProducts[i].productTitle}</td>
        <td>${allProducts[i].productPrice}</td>
        <td>${allProducts[i].taxes}</td>
        <td>${allProducts[i].ads}</td>
        <td>${allProducts[i].discount}</td>
        <td>${allProducts[i].total}</td>
        <td>${allProducts[i].count}</td>
        <td>${allProducts[i].category}</td>
        <td><button id="update">update</button></td>
        <td><button onclick="deleteProduct(${i})" id="delete">delete</button></td>
      </tr>
    `;
      document.getElementById("tbody").innerHTML = tbody;
    }
  }
}

// 5- delete one product:
function deleteProduct(i) {
  allProducts.splice(i, 1);
  localStorage.setItem("allProducts", JSON.stringify(allProducts));
  showData();
}

// 6- delete all:
function deleteAllProducts() {
  allProducts = [];
  localStorage.removeItem("allProducts");
  showData();
}
deleteAll.addEventListener("click", deleteAllProducts);

// 7- count:

