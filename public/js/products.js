
const addToCartButtons = document.querySelectorAll(".addToCart");
const existingCartId = localStorage.getItem('cartId');

async function verifyCart() {
  if (existingCartId !== null) {
    console.log(existingCartId, "el cart creado anteriormentessssss");
  } else {
    try {
      const response = await fetch(`/api/carts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log()
      localStorage.setItem('cartId', data._id);

    } catch (error) {
      console.error("Error:", error);
    }
  }
}

verifyCart();

const cartId = localStorage.getItem('cartId')


addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productId = e.target.dataset.productId;
    async function addProductCart() {
      const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
    }
    addProductCart()
  });
});
