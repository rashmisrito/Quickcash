# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Github Token : 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

# Seeders Command

Admin Table            : node src/seeders/admin-seeder.js

Fee Type               : node src/seeders/feetype-seeder.js

Fee Structure          : node src/seeders/feestructure-seeder.js

# How to set TimeZone default:

const date = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

# ReactNode

ReactNode is useful when you want to specify that a prop or variable can hold any type of content that can be rendered by React,
but you don't want to specify a more specific type.

For example, you might use ReactNode when you want to allow a prop to hold a string, a number, an element , or an array of elements.

It is important to note that ReactNode does not include the null or undefined values, so if you want to allow these values, you will
need to use the React.ReactNode type instead of just ReactNode.
