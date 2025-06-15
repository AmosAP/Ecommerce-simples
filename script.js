const API_URL = 'http://localhost:3001/products';
const productsContainer = document.getElementById('products-container');
const cartContainer = document.getElementById('cart-container');
const messageBox = document.getElementById('message');

let cart = JSON.parse(localStorage.getItem('cart')) || {};

function showMessage(text, type = 'success') {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  setTimeout(() => messageBox.textContent = '', 3000);
}

function updateCartDisplay() {
  cartContainer.innerHTML = '';
  Object.values(cart).forEach(product => {
    const subtotal = product.price * product.quantity;
    cartContainer.innerHTML += `
      <div class="card">
        <h4>${product.name}</h4>
        <p>Preço: € ${product.price}</p>
        <p>Quantidade: ${product.quantity}</p>
        <p>Subtotal: € ${subtotal.toFixed(2)}</p>
        <button onclick="removeFromCart(${product.id})">Remover</button>
      </div>
    `;
  });
  localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(id) {
  delete cart[id];
  updateCartDisplay();
  showMessage('Produto removido do carrinho.');
}

function addToCart(product) {
  if (product.stock <= 0) {
    showMessage('Produto fora de estoque.', 'error');
    return;
  }

  if (!cart[product.id]) {
    cart[product.id] = { ...product, quantity: 1 };
  } else {
    if (cart[product.id].quantity >= product.stock) {
      showMessage('Quantidade máxima em estoque atingida.', 'error');
      return;
    }
    cart[product.id].quantity += 1;
  }

  updateCartDisplay();
  showMessage('Produto adicionado ao carrinho!');
}

function renderProducts(products) {
  productsContainer.innerHTML = '';
  products.forEach(product => {
    productsContainer.innerHTML += `
      <div class="card">
        <h3>${product.name}</h3>
        <p>Preço: € ${product.price}</p>
        <p>Estoque: ${product.stock}</p>
        <button onclick='addToCart(${JSON.stringify(product)})'>Adicionar</button>
      </div>
    `;
  });
}

async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderProducts(data);
  } catch (err) {
    showMessage('Erro ao carregar produtos.', 'error');
  }
}

loadProducts();
updateCartDisplay();
