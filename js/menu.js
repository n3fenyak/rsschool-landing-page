const menuCards = document.querySelector('.menu__cards')
const menuTabs = document.querySelectorAll('.menu-tab')
const showMoreButton = document.querySelector('.menu__refresh')

const modal = document.querySelector('.product-modal')
const modalOverlay = document.querySelector('.product-modal__overlay')
const modalImage = document.querySelector('.product-modal__image')
const modalTitle = document.querySelector('.product-modal__title')
const modalDescription = document.querySelector('.product-modal__description')
const modalSizes = document.querySelector('.product-modal__sizes')
const modalAdditives = document.querySelector('.product-modal__additives')
const modalPrice = document.querySelector('.product-modal__price')
const modalCloseButton = document.querySelector('.product-modal__close')

let allProducts = []
let activeCategory = 'coffee'
let isExpanded = false

let currentProduct = null
let selectedSize = 's'
let selectedAdditives = new Set()

function getCategoryProducts() {
  return allProducts.filter((product) => product.category === activeCategory)
}

function renderProducts(products) {
  menuCards.innerHTML = ''

  const categoryProducts = getCategoryProducts()

  products.forEach((product) => {
    const productIndex = categoryProducts.findIndex(
      (item) => item.name === product.name
    )

    menuCards.innerHTML += `
      <article
        class="menu-card"
        data-product-name="${product.name}"
      >
        <div class="menu-card__image-box">
          <img
            class="menu-card__image"
            src="../assets/images/${product.category}-${productIndex + 1}.png"
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

function renderCategory() {
  const categoryProducts = getCategoryProducts()
  const isMobile = window.innerWidth <= 768

  let visibleProducts = categoryProducts

  if (isMobile && !isExpanded) {
    visibleProducts = categoryProducts.slice(0, 4)
  }

  renderProducts(visibleProducts)

  const hasHiddenProducts =
    isMobile && !isExpanded && categoryProducts.length > 4

  showMoreButton.hidden = !hasHiddenProducts
}

function getProductImage(product) {
  const categoryProducts = allProducts.filter(
    (item) => item.category === product.category
  )

  const productIndex = categoryProducts.findIndex(
    (item) => item.name === product.name
  )

  return `../assets/images/${product.category}-${productIndex + 1}.png`
}

function calculateTotal() {
  if (!currentProduct) {
    return
  }

  let total = Number(currentProduct.price)

  total += Number(currentProduct.sizes[selectedSize]['add-price'])

  selectedAdditives.forEach((index) => {
    total += Number(currentProduct.additives[index]['add-price'])
  })

  modalPrice.textContent = `$${total.toFixed(2)}`
}

function renderSizes() {
  modalSizes.innerHTML = ''

  Object.entries(currentProduct.sizes).forEach(([key, value]) => {
    const button = document.createElement('button')

    button.className = 'product-modal__option'
    button.type = 'button'
    button.dataset.size = key

    if (key === selectedSize) {
      button.classList.add('product-modal__option--active')
    }

    button.innerHTML = `
        <span class="product-modal__option-icon">
          ${key.toUpperCase()}
        </span>
        <span>${value.size}</span>
      `

    modalSizes.append(button)
  })
}

function renderAdditives() {
  modalAdditives.innerHTML = ''

  currentProduct.additives.forEach((additive, index) => {
    const button = document.createElement('button')

    button.className = 'product-modal__option'
    button.type = 'button'
    button.dataset.additive = index

    if (selectedAdditives.has(index)) {
      button.classList.add('product-modal__option--active')
    }

    button.innerHTML = `
      <span class="product-modal__option-icon">
        ${index + 1}
      </span>
      <span>${additive.name}</span>
    `

    modalAdditives.append(button)
  })
}

function openModal(product) {
  currentProduct = product

  selectedSize = 's'
  selectedAdditives.clear()

  modalImage.src = getProductImage(product)
  modalImage.alt = product.name

  modalTitle.textContent = product.name
  modalDescription.textContent = product.description

  renderSizes()
  renderAdditives()
  calculateTotal()

  modal.hidden = false
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  modal.hidden = true
  document.body.style.overflow = ''

  currentProduct = null
  selectedSize = 's'
  selectedAdditives.clear()
}

menuTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activeCategory = tab.dataset.category
    isExpanded = false

    menuTabs.forEach((item) => {
      item.classList.remove('menu-tab--active')
    })

    tab.classList.add('menu-tab--active')

    renderCategory()
  })
})

showMoreButton.addEventListener('click', () => {
  isExpanded = true
  renderCategory()
})

menuCards.addEventListener('click', (event) => {
  const card = event.target.closest('.menu-card')

  if (!card) {
    return
  }

  const product = allProducts.find(
    (item) => item.name === card.dataset.productName
  )

  if (product) {
    openModal(product)
  }
})

modalSizes.addEventListener('click', (event) => {
  const button = event.target.closest('.product-modal__option')

  if (!button) {
    return
  }

  selectedSize = button.dataset.size

  renderSizes()
  calculateTotal()
})

modalAdditives.addEventListener('click', (event) => {
  const button = event.target.closest('.product-modal__option')

  if (!button) {
    return
  }

  const additiveIndex = Number(button.dataset.additive)

  if (selectedAdditives.has(additiveIndex)) {
    selectedAdditives.delete(additiveIndex)
  } else {
    selectedAdditives.add(additiveIndex)
  }

  renderAdditives()
  calculateTotal()
})

modalCloseButton.addEventListener('click', closeModal)

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    closeModal()
  }
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) {
    closeModal()
  }
})

window.addEventListener('resize', () => {
  renderCategory()
})

fetch('../data/products.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return response.json()
  })
  .then((products) => {
    allProducts = products
    renderCategory()
  })
  .catch((error) => {
    console.error('Failed to load products:', error)
  })
