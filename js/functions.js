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
        const productElement = event.target.parentElement
        const productImage = productElement.querySelector('.product-image');
        const productImageSrc = productImage.getAttribute('src');
        const productName = productElement.querySelector('.product-name').textContent;
        const productPrice = productElement.querySelector('.product-price').textContent;

        // Aquí puedes añadir la lógica para agregar el producto al carrito
        const cartItem = document.createElement('div');
        cartItem.classList.add('main__cart-item');
        cartItem.innerHTML = `
            <img src="${productImageSrc}" alt="${productName}">
            <p>${productName}</p>
            <p>${productPrice}</p>
            <i class="erase"><img src="img/recycle.png" alt="Icono Quitar"></i>
        `;
        cartItemsContainer.appendChild(cartItem);
        updateCartCount();
        updateCartEmptyMessage();
        saveCartToSession();
        updateCartTotalAndButton();

        // Añadir el evento para eliminar el producto del carrito
        const icon = cartItem.querySelector('.erase');
        icon.addEventListener('click', () => {
            cartItem.remove();
            updateCartCount();
            updateCartEmptyMessage();
            saveCartToSession();
            updateCartTotalAndButton();
        });
        

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
    updateCartCount();
    updateCartEmptyMessage();
    loadCartFromSession();
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
        name: item.querySelector('p:nth-of-type(1)').textContent,
        price: item.querySelector('p:nth-of-type(2)').textContent
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
                <p>${product.price}</p>
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
            });
        });
        updateCartCount();
        updateCartEmptyMessage();
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
        const priceText = item.querySelector('p:nth-of-type(2)').textContent;
        const price = parseFloat(priceText.replace(/[^0-9.]/g, '').replace(',', ''));
        total += price;
    });
    document.querySelector('.main__cart-total-amount').textContent = `$${total.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    const buyButton = document.querySelector('.main__cart-buy');
    buyButton.disabled = cartItems.length === 0;
}