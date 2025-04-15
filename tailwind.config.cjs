const defaultTheme = require("tailwindcss/defaultTheme");



module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
      // fontSize: {
      //   'display-1': '95px',     
      //   'heading-1': '40px',      
      //   'heading-2': '25px',      
      //   'heading-3': '25px',      
      //   'paragraph-1': '25px',    
      //   'paragraph-2': '20px',    
      // },
      // fontWeight: {
      //   semiBold: 600, 
      //   medium: 500,  
      //   regular: 400,  
      // },
      
    },
  },
  corePlugins: {
    fontSize: false,
  },
  plugins: [require("tailwindcss-fluid-type"),('daisyui'),('flowbite/plugin')],
  darkMode: ['selector', '[data-theme="dark"]'],
};

      