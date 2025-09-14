let productTitle = document.getElementById("product-title");
let alert = document.querySelector(".alert");
let productPrice = document.getElementById("product-price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let cancel = document.getElementById("cancel");
let empty = document.getElementById("empty");
let productsCount = document.getElementById("products-count");
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
    total.innerHTML = 0;
    total.style.backgroundColor = "#1f4a6f80";
  }
}
getTotal(); // to toggle style for total box when website starting.
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
  hj('event', 'create_product');
  let product = {
    productTitle: productTitle.value.toLowerCase(),
    productPrice: productPrice.value,
    taxes: taxes.value || 0,
    ads: ads.value || 0,
    discount: discount.value || 0,
    total: total.innerHTML,
    count: parseFloat(count.value) || 1,
    category: category.value.toLowerCase(),
  };
  if (
    productTitle.value != "" &&
    productPrice.value != "" &&
    category.value != ""
  ) {
    /* start control mode */
    if (mode === "create") {
      // check if productTitle is unique:
      for (let i = 0; i < allProducts.length; i++) {
        if (productTitle.value.toLowerCase() == allProducts[i].productTitle) {
          alert.style.visibility = "visible";
          setTimeout(() => {
            alert.style.visibility = "hidden";
          }, 2500);
          return;
        }
      }
      allProducts.unshift(product);
    } else {
      allProducts[num] = product;
      submit.innerHTML = "create";
      mode = "create";
      cancel.style.display = "none";
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

// empty inputs button:
empty.addEventListener("click", function () {
  clearInputs();
  getTotal();
});

/* 4- start show data: */
function toggleDeleteAllAndProducts() {
  if (allProducts.length > 0) {
    deleteAll.style.visibility = "visible";
    productsCount.style.visibility = "visible";
    productsCount.innerHTML = `products: ( ${allProducts.length} )`;
  } else {
    deleteAll.style.visibility = "hidden";
    productsCount.style.visibility = "hidden";
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
        <td>${allProducts[i].category}</td>
        <td>
          <p>${allProducts[i].count}</p>
          <div>
            <i class="fa-solid fa-minus" onclick="minusOne(${i})"></i>
            <i class="fa-solid fa-plus" onclick="plusOne(${i})"></i>
          </div>
        </td>
        <td><i class="fa-solid fa-pen" onclick="updateProduct(${i})" id="update"></i></td>
        <td><i class="fa-solid fa-trash-can" onclick="deleteProduct(${i})" id="delete"></i></td>
      </tr>
    `;
      document.getElementById("tbody").innerHTML = table;
    }
  }
  getTotal(); // to toggle style for total box
  toggleDeleteAllAndProducts();
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
   hj('event', 'delete_all_products');
}
deleteAll.addEventListener("click", deleteAllProducts);

// 7- update:
function updateProduct(i) {
  productTitle.value = allProducts[i].productTitle;
  productPrice.value = allProducts[i].productPrice;
  taxes.value = allProducts[i].taxes;
  ads.value = allProducts[i].ads;
  discount.value = allProducts[i].discount;
  getTotal();
  total.value = allProducts[i].total;
  count.value = allProducts[i].count;
  category.value = allProducts[i].category;
  submit.innerHTML = "update";
  mode = "update";
  cancel.style.display = "block";
  num = i;
  scrollTo({
    top: 0,
  });
}

// cancel update:
cancel.addEventListener("click", function () {
  mode = "create";
  submit.innerHTML = "create";
  cancel.style.display = "none";
  clearInputs();
  getTotal();
});

// plus or minus function:
function plusOne(num) {
  allProducts[num].count += 1;
  localStorage.setItem("allProducts", JSON.stringify(allProducts));
  allProducts = JSON.parse(localStorage.getItem("allProducts"));
  showData();
}
function minusOne(num) {
  allProducts[num].count -= 1;
  localStorage.setItem("allProducts", JSON.stringify(allProducts));
  allProducts = JSON.parse(localStorage.getItem("allProducts"));
  if (allProducts[num].count == 0) {
    allProducts.splice(num, 1);
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
    allProducts = JSON.parse(localStorage.getItem("allProducts"));
  }
  showData();
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
        <td>${allProducts[i].category}</td>
        <td>
          <p>${allProducts[i].count}</p>
          <div>
            <i class="fa-solid fa-minus" onclick="minusOne(${i})"></i>
            <i class="fa-solid fa-plus" onclick="plusOne(${i})"></i>
          </div>
        </td>
        <td><i class="fa-solid fa-pen" onclick="updateProduct(${i})" id="update"></i></td>
        <td><i class="fa-solid fa-trash-can" onclick="deleteProduct(${i})" id="delete"></i></td>
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
        <td>${allProducts[i].category}</td>
        <td>
          <p>${allProducts[i].count}</p>
          <div>
            <i class="fa-solid fa-minus" onclick="minusOne(${i})"></i>
            <i class="fa-solid fa-plus" onclick="plusOne(${i})"></i>
          </div>
        </td>
        <td><i class="fa-solid fa-pen" onclick="updateProduct(${i})" id="update"></i></td>
        <td><i class="fa-solid fa-trash-can" onclick="deleteProduct(${i})" id="delete"></i></td>
      </tr>
        `;
      }
    }
  }
  document.getElementById("tbody").innerHTML = table;
}
/** end search **/
// start go to up button:
let goUP = document.getElementById("myBtn");
window.onscroll = function () {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    goUP.style.display = "block";
  } else {
    goUP.style.display = "none";
  }
};
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}
// end go to up button:
/** The End Of App **/
