const menuCards = document.querySelector('.menu__cards')

function renderProducts(products) {
  menuCards.innerHTML = ''

  products.forEach((product, index) => {
    menuCards.innerHTML += `
      <article class="menu-card">
        <div class="menu-card__image-box">
          <img
            class="menu-card__image"
            src="../assets/images/${product.category}-${index + 1}.png"
            alt="${product.name}"
          >
        </div>

        <div class="menu-card__description">
          <div class="menu-card__info">
            <h2 class="menu-card__title">${product.name}</h2>
            <p class="menu-card__text">${product.description}</p>
          </div>

          <p class="menu-card__price">$${product.price}</p>
        </div>
      </article>
    `
  })
}

fetch('../data/products.json')
  .then((response) => response.json())
  .then((products) => {
    const coffeeProducts = products.filter(
      (product) => product.category === 'coffee'
    )

    renderProducts(coffeeProducts)
  })
  .catch((error) => {
    console.error('Failed to load', error)
  })

const menuTabs = document.querySelectorAll('.menu-tabs')
