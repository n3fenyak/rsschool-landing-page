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
