# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# ReactNode

ReactNode is useful when you want to specify that a prop or variable can hold any type of content that can be rendered by React,
but you don't want to specify a more specific type.

For example, you might use ReactNode when you want to allow a prop to hold a string, a number, an element , or an array of elements.

It is important to note that ReactNode does not include the null or undefined values, so if you want to allow these values, you will
need to use the React.ReactNode type instead of just ReactNode.

# React Topics

# forwardRef: 

Let component receive a ref and forward it to a child component.

forwardRef accepts a render function as an argument. React calls this function with props and ref:

const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});

# React Strict Mode

In strict mode, React will call render function twice in order to help us to find accidental impurities. This is development-only behaviour and does noy affect production.

If your render function is pure , this should not affect the logic of your component. The result from one of the calls will be ignored.

