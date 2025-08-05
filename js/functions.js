const cartIcon = document.querySelector('.cart');
const cart = document.querySelector('.main__cart');
const closeCart = document.querySelector('.close-cart');

closeCart.addEventListener('click', () => {
  cart.classList.add('hide');
  cart.classList.remove('show');
});
cartIcon.addEventListener('click', () => {
  cart.classList.add('show');
  cart.classList.remove('hide');
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
        cart.appendChild(cartItem);
        updateCartCount();
        updateCartEmptyMessage();

        // Añadir el evento para eliminar el producto del carrito
        const icon = cartItem.querySelector('.erase');
        icon.addEventListener('click', () => {
            cartItem.remove();
            updateCartCount();
            updateCartEmptyMessage();
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
