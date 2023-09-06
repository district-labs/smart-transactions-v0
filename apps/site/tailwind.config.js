// tailwind config is required for editor support

const sharedConfig = require("tailwind-config/tailwind.config.js")

module.exports = {
  presets: [sharedConfig],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('/story/home.png')",
      },
    },
  },
}
