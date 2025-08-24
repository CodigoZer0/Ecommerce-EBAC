const cartIcon = document.querySelector('.cart');
const cart = document.querySelector('.main__cart');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.main__cart-items-slider');


closeCart.addEventListener('click', () => {
  cart.classList.add('hide');
  cart.classList.remove('show');
});
cartIcon.addEventListener('click', () => {
  cart.classList.add('show');
  cart.classList.remove('hide');
});
// Función para mostrar el menú al hacer clic en el icono del menú
const menuIcon = document.querySelector('.menu');
const navMenu = document.querySelector('.main__nav');
const closeMenu = document.querySelector('.main__nav-close');
menuIcon.addEventListener('click', () => {
    navMenu.classList.add('show');
    navMenu.classList.remove('hide');
});
closeMenu.addEventListener('click', () => {
    navMenu.classList.add('hide');
    navMenu.classList.remove('show');
});

// Función para eliminar un producto del carrito
const eraseIcon = document.querySelectorAll('.erase'); 
eraseIcon.forEach((icon) => {
    icon.addEventListener('click', () => {
        const parentElement = icon.parentElement;
        parentElement.remove();

    });
});

// Función para añadir un producto al carrito
const addToCartButtons = document.querySelectorAll('.add-to-cart');
console.log(addToCartButtons);
addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const productElement = event.target.parentElement;
        const productImage = productElement.querySelector('.product-image');
        const productImageSrc = productImage.getAttribute('src');
        const productName = productElement.querySelector('.product-name').textContent;
        const productPrice = productElement.querySelector('.product-price').textContent;

        // Busca si ya existe el producto en el carrito
        const existingCartItem = Array.from(cartItemsContainer.querySelectorAll('.main__cart-item'))
            .find(item => item.querySelector('p').textContent === productName);

        if (existingCartItem) {
            // Si existe, aumenta la cantidad y actualiza el subtotal
            const quantityElem = existingCartItem.querySelector('.cart-item-quantity');
            let quantity = parseInt(quantityElem.textContent, 10);
            quantity++;
            quantityElem.textContent = quantity;

            // Actualiza el subtotal
            const priceValue = parseFloat(productPrice.replace(/[^0-9.]/g, '').replace(',', ''));
            existingCartItem.querySelector('.cart-item-subtotal').textContent =
                `$${(priceValue * quantity).toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
        } else {
            // Si no existe, lo agrega con cantidad 1
            const cartItem = document.createElement('div');
            cartItem.classList.add('main__cart-item');
            cartItem.innerHTML = `
                <img src="${productImageSrc}" alt="${productName}">
                <p>${productName}</p>
                <span class="cart-item-quantity">1</span> x 
                <span class="cart-item-price">${productPrice}</span>
                <span class="cart-item-subtotal">${productPrice}</span>
                <i class="erase"><img src="img/recycle.png" alt="Icono Quitar"></i>
            `;
            cartItemsContainer.appendChild(cartItem);

            // Evento para eliminar el producto del carrito
            const icon = cartItem.querySelector('.erase');
            icon.addEventListener('click', () => {
                cartItem.remove();
                updateCartCount();
                updateCartEmptyMessage();
                saveCartToSession();
                updateCartTotalAndButton();
            });
        }

        updateCartCount();
        updateCartEmptyMessage();
        saveCartToSession();
        updateCartTotalAndButton();
    });
});

// Función para actualizar el contador del carrito
const updateCartCount = () => {
    const cartItems = document.querySelectorAll('.main__cart-item');
    const cartCount = document.querySelector('.header__cart-count');
    cartCount.textContent = cartItems.length;
    console.log(`Total items in cart: ${cartItems.length}`);
};

// Inicializar el contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromSession();
    updateCartCount();
    updateCartEmptyMessage();
    updateCartTotalAndButton();
});
// Función para mostrar un mensaje si el carrito está vacío
const updateCartEmptyMessage = () => {
    const cartItems = document.querySelectorAll('.main__cart-item');
    let cartEmptyMessage = document.querySelector('.main__cart-empty');
    if (cartItems.length === 0) {
        if (!cartEmptyMessage) {
            cartEmptyMessage = document.createElement('p');
            cartEmptyMessage.className = 'main__cart-empty';
            cartEmptyMessage.textContent = '¡El carrito está vacío añade más productos!';
            document.querySelector('.main__cart').appendChild(cartEmptyMessage);
        }
    } else {
        if (cartEmptyMessage) {
            cartEmptyMessage.remove();
        }
    }
};
//Función para guardar los productos del carrito en la sesión
function saveCartToSession() {
    const cartItems = Array.from(document.querySelectorAll('.main__cart-item')).map(item => ({
        image: item.querySelector('img').getAttribute('src'),
        name: item.querySelector('p').textContent,
        price: item.querySelector('.cart-item-price').textContent,
        quantity: item.querySelector('.cart-item-quantity').textContent,
        subtotal: item.querySelector('.cart-item-subtotal').textContent
    }));
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
}

function loadCartFromSession() {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
        const cartItems = JSON.parse(cartData);
        cartItems.forEach(product => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('main__cart-item');
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <p>${product.name}</p>
                <span class="cart-item-quantity">${product.quantity}</span> x 
                <span class="cart-item-price">${product.price}</span>
                <span class="cart-item-subtotal">${product.subtotal}</span>
                <i class="erase"><img src="img/recycle.png" alt="Icono Quitar"></i>
            `;
            cartItemsContainer.appendChild(cartItem);

            // Evento para eliminar el producto del carrito
            const icon = cartItem.querySelector('.erase');
            icon.addEventListener('click', () => {
                cartItem.remove();
                updateCartCount();
                updateCartEmptyMessage();
                saveCartToSession();
                updateCartTotalAndButton();
            });
        });
        updateCartCount();
        updateCartEmptyMessage();
        updateCartTotalAndButton();
    }
}
// Función para desplegar submenú de productos
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.main__nav-dropdown');
    if (dropdown) {
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });
        // Cierra el menú si haces click fuera
        document.addEventListener('click', () => {
            dropdown.classList.remove('open');
        });
    }
});
function updateCartTotalAndButton() {
    const cartItems = document.querySelectorAll('.main__cart-item');
    let total = 0;
    cartItems.forEach(item => {
        const subtotalText = item.querySelector('.cart-item-subtotal').textContent;
        const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, '').replace(',', ''));
        total += subtotal;
    });
    document.querySelector('.main__cart-total-amount').textContent = `$${total.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    const buyButton = document.querySelector('.main__cart-buy');
    buyButton.disabled = cartItems.length === 0;
}