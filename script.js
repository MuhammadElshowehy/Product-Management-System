let productTitle = document.getElementById("product-title");
let productPrice = document.getElementById("product-price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let deleteAll = document.getElementById("delete-all");
let search = document.getElementById("search");
let mode = "create"; // mode: create or update product.
let num; // fake var, his value will send from update function To create & update function.

// 1- get total:
function getTotal() {
  if (productPrice.value != "") {
    total.innerHTML =
      +productPrice.value + +taxes.value + +ads.value - +discount.value;
    total.style.backgroundColor = "#1F4A6F";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "#1f4a6f80";
  }
}
getTotal(); // to toggle style for total box when website starting
productPrice.addEventListener("keyup", getTotal);
taxes.addEventListener("keyup", getTotal);
ads.addEventListener("keyup", getTotal);
discount.addEventListener("keyup", getTotal);

// check local storage when program starting:
let allProducts;
if (localStorage.getItem("allProducts") != null) {
  allProducts = JSON.parse(localStorage.getItem("allProducts"));
  showData();
} else {
  allProducts = [];
}
// 2- create & update products:
submit.addEventListener("click", function () {
  let product = {
    productTitle: productTitle.value.toLowerCase(),
    productPrice: productPrice.value,
    taxes: taxes.value || 0,
    ads: ads.value || 0,
    discount: discount.value || 0,
    total: total.innerHTML,
    count: count.value || 1,
    category: category.value.toLowerCase(),
  };
  if (
    productTitle.value != "" &&
    productPrice.value != "" &&
    category.value != "" &&
    count.value <= 100
  ) {
    /* start control mode */
    if (mode === "create") {
      // count logic:
      if (product.count > 1) {
        for (let i = 0; i < product.count; i++) {
          allProducts.push(product);
        }
      } else {
        // product.count = 1;
        allProducts.push(product);
      }
    } else {
      allProducts[num] = product;
      count.style.display = "block";
      submit.innerHTML = "create";
      mode = "create";
    }
    /* end control mode */
    clearInputs();
  }
  localStorage.setItem("allProducts", JSON.stringify(allProducts));
  showData();
});

// 3- clear inputs after click submit button:
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

/* 4- start show data: */
function toggleDeleteAll() {
  if (allProducts.length > 0) {
    deleteAll.style.display = "block";
    deleteAll.innerHTML = `Delete All (${allProducts.length})`;
  } else {
    deleteAll.style.display = "none";
  }
}
function showData() {
  if (allProducts.length == 0) {
    document.getElementById("tbody").innerHTML = "";
  } else {
    let table = "";
    for (let i = 0; i < allProducts.length; i++) {
      table += `
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
        <td><button onclick="updateProduct(${i})" id="update">update</button></td>
        <td><button onclick="deleteProduct(${i})" id="delete">delete</button></td>
      </tr>
    `;
      document.getElementById("tbody").innerHTML = table;
    }
  }
  getTotal(); // to toggle style for total box
  toggleDeleteAll();
}
/* end show data */

// 5- delete one product:
function deleteProduct(i) {
  allProducts.splice(i, 1);
  localStorage.setItem("allProducts", JSON.stringify(allProducts));
  showData();
}

// 6- delete all products:
function deleteAllProducts() {
  allProducts = [];
  localStorage.removeItem("allProducts");
  showData();
}
deleteAll.addEventListener("click", deleteAllProducts);

// 7- update:
function updateProduct(i) {
  productTitle.value = allProducts[i].productTitle;
  productPrice.value = allProducts[i].productPrice;
  taxes.value = allProducts[i].taxes;
  ads.value = allProducts[i].ads;
  discount.value = allProducts[i].discount;
  total.value = allProducts[i].total;
  count.value = allProducts[i].count;
  getTotal();
  category.value = allProducts[i].category;
  count.style.display = "none";
  submit.innerHTML = "update";
  mode = "update";
  num = i;
  scrollTo({
    top: 0,
  });
}

/** 8- start search **/
let searchMode = "title";
function getSearchMode(id) {
  if (id == "search-title") {
    searchMode = "title";
  } else {
    searchMode = "category";
  }
  search.value = "";
  search.placeholder = `search by ${searchMode}`;
  search.focus();
  showData();
}
function searchProducts(keyWord) {
  let table = "";
  for (let i = 0; i < allProducts.length; i++) {
    if (searchMode == "title") {
      if (allProducts[i].productTitle.includes(keyWord.toLowerCase())) {
        table += `
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
            <td><button onclick="updateProduct(${i})" id="update">update</button></td>
            <td><button onclick="deleteProduct(${i})" id="delete">delete</button></td>
          </tr>
        `;
      }
    } else {
      if (allProducts[i].category.includes(keyWord.toLowerCase())) {
        table += `
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
            <td><button onclick="updateProduct(${i})" id="update">update</button></td>
            <td><button onclick="deleteProduct(${i})" id="delete">delete</button></td>
          </tr>
        `;
      }
    }
  }
  document.getElementById("tbody").innerHTML = table;
}
/** end search **/
// go to up button:
let goUP = document.getElementById("myBtn");
window.onscroll = function () {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    goUP.style.display = "block";
  } else {
    goUP.style.display = "none";
  }
};
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
/** The End Of App **/