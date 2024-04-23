let iconCart = document.querySelector(".icon-cart");
let body = document.querySelector("body");
let closeBtn = document.querySelector(".close");
let listProductHtml = document.querySelector(`.listProduct`);
let listCartHTML = document.querySelector(".listCart");
let iconCartSpan = document.querySelector(".icon-cart span");

let carts = [];
let listProduct = [];

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeBtn.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

const addToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

const addToHtml = () => {
  listProductHtml.innerHtml = "";
  // console.log(listProduct);
  if (listProduct.length >= 0) {
    listProduct.forEach((product) => {
      // console.log(product);
      let newProduct = document.createElement("div");
      newProduct.classList.add("item");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
      <div class="imageContainer">
      <img src="${product.image}" alt="#" srcset="" />
      </div>
      <h2>${product.name}</h2>
      <div class="price">$${product.price}</div>
      <button class="addCart">Add to cart</button>`;
      listProductHtml.appendChild(newProduct);
    });
  }
};

listProductHtml.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addCart")) {
    let product_id = positionClick.parentElement.dataset.id;
    addToCart(product_id);
  }
});

const addToCart = (product_id) => {
  let positionThisProduct = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProduct < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionThisProduct].quantity += 1;
  }
  addCartToHtml();
  addToMemory();
};

const addCartToHtml = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement("div");
      let positionThisProduct = listProduct.findIndex(
        (value) => value.id == cart.product_id
      );
      let info = listProduct[positionThisProduct];
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      newCart.innerHTML = `<div class="image">
      <img src="${info.image}" alt="#" srcset="" />
    </div>
    <div class="name">${info.name}</div>
    <div class="totalPrice">$${info.price}</div>
    <div class="quantity">
      <span class="plus">+</span>
      <span>${cart.quantity}</span>
      <span class="minus">-</span>
    </div>`;
      listCartHTML.appendChild(newCart);
    });
    iconCartSpan.innerText = totalQuantity;
  }
};

const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  console.log(positionItemInCart);
  if (positionItemInCart >= 0) {
    switch (type) {
      case "plus":
        carts[positionItemInCart].quantity += 1;
        break;
      default:
        let valueChange = (carts[positionItemInCart].quantity -= 1);
        if (valueChange > 0) {
          carts[positionItemInCart].quantity = valueChange;
        } else {
          carts.splice(positionItemInCart, 1);
          break;
        }
    }
    addToMemory();
    addCartToHtml();
  }
};

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("plus") ||
    positionClick.classList.contains("minus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantity(product_id, type);
  }
});

const initApp = () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      listProduct = data;
      addToHtml();
      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        addCartToHtml();
        // console.log(carts);
      }
    });
};

initApp();
