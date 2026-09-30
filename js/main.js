const themeSwitcher = document.querySelector('.theme-switcher')

const savedTheme = localStorage.getItem('theme')

if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark')
}

themeSwitcher.addEventListener('click', () => {
  const isDarkTheme =
    document.documentElement.getAttribute('data-theme') === 'dark'

  if (isDarkTheme) {
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('theme', 'light')
  } else {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  }
})

const burgerButton = document.querySelector('.burger')
const mobileMenu = document.querySelector('.mobile-menu')
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link')

function openMobileMenu() {
  burgerButton.classList.add('burger--open')
  mobileMenu.classList.add('mobile-menu--open')

  burgerButton.setAttribute('aria-label', 'Close menu')
  document.body.style.overflow = 'hidden'
}

function closeMobileMenu() {
  burgerButton.classList.remove('burger--open')
  mobileMenu.classList.remove('mobile-menu--open')

  burgerButton.setAttribute('aria-label', 'Open menu')
  document.body.style.overflow = ''
}

function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.contains('mobile-menu--open')

  if (isOpen) {
    closeMobileMenu()
  } else {
    openMobileMenu()
  }
}

burgerButton.addEventListener('click', toggleMobileMenu)

mobileMenuLinks.forEach((link) => {
  link.addEventListener('click', closeMobileMenu)
})

document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    mobileMenu.classList.contains('mobile-menu--open')
  ) {
    closeMobileMenu()
  }
})

window.addEventListener('resize', () => {
  if (
    window.innerWidth >= 769 &&
    mobileMenu.classList.contains('mobile-menu--open')
  ) {
    closeMobileMenu()
  }
})

const sliderContent = document.querySelector('.slider__content')

if (sliderContent) {
  const sliderImage = document.querySelector('.slider__image')
  const sliderTitle = document.querySelector('.slider__title')
  const sliderDescription = document.querySelector('.slider__description')
  const sliderPrice = document.querySelector('.slider__price')

  const prevButton = document.querySelector('.slider__button--prev')
  const nextButton = document.querySelector('.slider__button--next')
  const sliderControls = document.querySelectorAll('.slider__control')

  const slides = [
    {
      image: './assets/images/coffee-slider-1.png',
      alt: "S'mores Frappuccino",
      title: "S'mores Frappuccino",
      description:
        'This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.',
      price: '$5.50',
    },
    {
      image: './assets/images/coffee-slider-2.png',
      alt: 'Caramel Macchiato',
      title: 'Caramel Macchiato',
      description:
        'Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.',
      price: '$5.00',
    },
    {
      image: './assets/images/coffee-slider-3.png',
      alt: 'Ice coffee',
      title: 'Ice coffee',
      description:
        'A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.',
      price: '$4.50',
    },
  ]

  let currentSlide = 0
  let isSliding = false

  function updateControls() {
    sliderControls.forEach((control, index) => {
      control.classList.toggle(
        'slider__control--active',
        index === currentSlide
      )
    })
  }

  function renderSlide() {
    const slide = slides[currentSlide]

    sliderImage.src = slide.image
    sliderImage.alt = slide.alt
    sliderTitle.textContent = slide.title
    sliderDescription.textContent = slide.description
    sliderPrice.textContent = slide.price

    updateControls()
  }

  function changeSlide(direction) {
    if (isSliding) {
      return
    }

    isSliding = true
    sliderContent.classList.add('slider__content--changing')

    setTimeout(() => {
      currentSlide += direction

      if (currentSlide >= slides.length) {
        currentSlide = 0
      }

      if (currentSlide < 0) {
        currentSlide = slides.length - 1
      }

      renderSlide()

      sliderContent.classList.remove('slider__content--changing')

      setTimeout(() => {
        isSliding = false
      }, 300)
    }, 300)
  }

  prevButton.addEventListener('click', () => {
    changeSlide(-1)
  })

  nextButton.addEventListener('click', () => {
    changeSlide(1)
  })

  sliderControls.forEach((control, index) => {
    control.addEventListener('click', () => {
      if (index === currentSlide || isSliding) {
        return
      }

      isSliding = true
      sliderContent.classList.add('slider__content--changing')

      setTimeout(() => {
        currentSlide = index
        renderSlide()

        sliderContent.classList.remove('slider__content--changing')

        setTimeout(() => {
          isSliding = false
        }, 300)
      }, 300)
    })
  })
}
