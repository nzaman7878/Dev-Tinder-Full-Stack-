module.exports = {
    content: ['./src/**/*.{astro,html,svelte,vue,js,ts,jsx,tsx}'],
    plugins: [require('daisyui')],
    theme: { ... },
    daisyui: {
      themes: ['winter', 'night']
    },
    darkMode: ['selector', '[data-theme="night"]']
  }