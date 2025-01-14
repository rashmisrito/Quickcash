# What are components in React?

React component is a reusable piece of code responsible for rendering a part of the user interface. These components can be as simple as a button or as complex as an entire form.

The modular nature of React components allows developers to break down their applications into manageable and reusable chunks.

Example:-

// Functional Component

const Greeting  = () => {
  return <h1>Hello, Ganesh <h1>;
};


# Types of React Components

1) Functional Component

  They are stateless, focusing on presenting UI elements without managing state or lifecycle methods.

2) Class Component

  They can manage state and incorporate lifecycle methods, making them suitable for components requiring dynamic behaviour and interaction.

# Virtual DOM

A Virtual DOM is a lightweight copy of the Real DOM, which React uses to improve performance. It is a JavaScript object that mirrors the structure of the actual DOM, but is kept in memory.

When a React app starts, React creates a Virtual DOM that represents the initial state of the UI.
When an event (like a button click) causes a change in the state of a component, React updates the Virtual DOM, not the real DOM directly.
React compares the updated Virtual DOM with the previous version of the Virtual DOM. This process is called reconciliation.
React uses a diffing algorithm to efficiently compare the old and new Virtual DOMs. It checks which parts of the UI have changed.
After finding the differences, React updates only the parts of the real DOM that have changed. This reduces the number of changes made to the actual DOM, which improves performance.
Instead of re-rendering the entire UI, React can selectively update parts of the UI that are impacted by the state change.


# Comparing the Virtual DOM to Real DOM

The real DOM represents the whole HTML document as a tree structure and allows JavaScript to manipulate and change HTML documents. Sometimes when those changes occur, the whole document might re-render.

This is in contrast to the virtual DOM, which uses a diff algorithm to compare the current and previous versions of updates to the DOM. It only re-renders the parts of the UI that have changed, instead of the whole thing.

Note: Virtual DOM is not a browser feature, it acts as an intermediary between React and the browser,not a replacement for the real DOM.

# Lifting State Up?

Lifting state up is a pattern in React where you move the state from a lower-level component to a higher-level component, so that it can be shared between multiple child components.

# What is JSX ?

JSX is a javascript extension syntax used in React to easily write HTML and javascript together.

const jsx = <h1>This is JSX</h1>

This is simple JSX code in React. But the browser does not understand this JSX because it's not valid JavaScript code. So to convert it to browser understandable JavaScript code, we use a tool like Babel which is a JavaScript compiler/transpiler.

# What is state in React ?

In React, state is JavaScript object that holds data that can be used to influence the rendering of a component.

The state allows developers to create dynamic and interactive UIs by enabling components to respond to user input, API resources, or other events.

Why state important in React ?

1) Dynamic UIs

State allows you to create dynamic, data-driven UIs. Whether it’s updating a counter, displaying a list of items, or toggling between different views, the state enables your UI to respond to user interactions and changing data.

2) User Input Handling

React components can capture and respond to user input, such as clicks, keyboard events, and form submissions, by updating their state. This interaction is what makes web applications interactive and user-friendly.

3) Data Persistance

The state is essential for managing and persisting data within a component. For example, when a user fills out a form or interacts with a complex UI element, React components can store and manage this data using state.

4) Efficient Updates

React’s virtual DOM and reconciliation algorithm work hand in hand with the state to ensure that only the necessary parts of the UI are updated when the state changes. This efficiency is crucial for maintaining good performance in React applications.

# How to use useState in React ?

To use state in a React Component, you need to follow these steps:

1) Initialize State
2) Render State Data
3) Update State

# Why do we need to use useState in React to store variable values?

The reason is React does one-way data binding. 

When we change a local variable in React through our UI, React has no idea that the variable git changed and hence it will not re-render the required components, To overcome this we can use useState. When the value/state of that local state variable is changed, React uses reconciliation to re-render the changed components.

# The concept of Data Binding ?

Data binding in React refers to the synchronization of data between the components in your application and the user interface (UI). React primarily uses one-way data binding, which means that data flows in a single direction, from component's state to the UI. However, you can also achieve two-way data binding when necessary using controlled components.

One-Way Data Binding:

In one-way data binding, data flows from a parent component to a child component. The parent passes data (props) to the child, and any changes to that data in the child do not affect the parent. Here’s an example:

Two-Way Data Binding (Using Controlled Components):

Two-way data binding allows changes in a child component to affect the parent component and vice versa. This is often used with form elements and controlled components. Here’s an example:

# How does props work in React?

Props are used to store data that can be accessed by the children of a React Component. It act as a channel for component communication. Props are passed from parent to child and help your child access properties that made it into the parent's tree.

# defaultProps

The defaultProps is a React component property that allows us to set default values for the props argument.

Let's go ahead and create a default prop:

import React from "react";

function MyProducts({ name, description, price }) {
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
      <p>{price}</p>
    </div>
  );
}

Myproducts.defaultProps = {
  name: "temitope",
  description: "i like this feature",
  price: 500,
};

export default MyProducts;

# Props vs State in React

The first difference to note is while props are read-only and are immutable, while states change asynchronously and is mutable.

A state can change over time, and this change can happen as a response to a user action or a system event. State can only be accessed or modified inside the component.

Props, on the other hand, allow passing of data from one component to another. Here's a table below to show how they differ:

# render()

The render method is a lifecycle method that is called automatically by React during the lifecycle of a component.

It is resposible for describing what should be displayed on the screen.

render is still a fundamental part of class components in React.

# function of render()

The function of render in react is to return the jsx elements that make up the component's UI. It must return a single root element, which can be a React element, an array of elements, or null for no rendering.

# What is the return value of ReactDOM.render?

ReactDOM.render takes a React element and a DOM node and renders the element into the DOM. The return value is a reference to the component, which can be used for managing the instance.

# what is conditional rendering in React?

Conditional rendering in React is a technique that allows you to render different components or elements based on a certain condition.

# What are keys in React ?

Keys in React are a special string attribute that you pass to components when they're created in a list. They play a crucial role in reconciliation process, which is the algorithm React uses to diff one tree with another to determine which parts need updates.

React uses keys to determine whether items have changed, been added, or removed. They contribute to the array's items having a consistent identity.

Importance of Keys in React

Keys are significant in React because they aid in determining whether items in a list have been changed, updated, or removed. This process helps react to optimize the rendering by recycling existing DOM elements.

When an element's key changes, React will create a new component instance rather than update the current one.

# Event handling in React

Events in React refer to actions that happen in the user interface, such as a mouse click, a keyboard key press, or a form submission. 

In React, events are handled by defining event handlers, which are functions that are executed in response to a specific event.

React uses a synthetic event system, which is a wrapper around the native browser events. This allows React to provide a consistent and predictable way to handle events across different browsers and platforms.

When an event occurs, React creates a synthetic event object, which contains information about the event, such as the type of event, the target element, and any additional data related to the event. The event object is then passed to the event handler function, which can access and manipulate the event data.

# Pure Component

In React, a PureComponent is a component that optimizes the rendering process by avoiding unnecessary updates. It implements a shouldComponentUpdate method with a shallow prop and state comparison. Unlike a regular component, which re-renders whenever a state or props changes, a PureComponent performs a shallow comparison to determine if the actual values have changed, not just the reference.

# How PureComponent Optimizes Performance

The performance optimization in PureComponent comes from the shallow comparison it performs on the component's props and state. This shallow comparison checks if new props and state are the same as the old ones by comparing their values for primitive types and the references for object types.

When a PureComponent receives new props or state, it compares them to the previous props and state and re-renders only if it detects changes.

# Differences Between Component and PureComponent

The main difference between a Component and a PureComponent in React is how they handle updates and re-rendering. Both class and pure components have access to React's lifecycle methods but use the shouldComponentUpdate method differently.

A regular Component does not implement shouldComponentUpdate, which means it has the default behavior of re-rendering whenever its state or props change. This can lead to performance issues if the component updates frequently or if the re-rendering triggers a large component subtree to update.

# What is the Virtual DOM and How does it Work ?

The virtual DOM is an in-memory representation of the real DOM elements. Instead of interacting directly with the real DOM, which can be slow and costly in terms of performance, React creates a virtual representation of the UI components.

Here's a step-by-step process of how the virtual DOM works:

Step 1: Initial Rendering:

When the app starts, the entire UI is represented as a Virtual DOM. React elements are created and rendered into the virtual structure.

Step 2: State and Props changes:

As the states and props change in the app, React re-renders the affected components in the virtual DOM. These changes do not immediately impact the real DOM.

Step 3: Comparison Using Diff Algorithm:

React then uses a diffing algorithm to compare the current version of the virtual DOM with the previous version. This process identifies the differences.

Step 4: Reconciliation Process:

based on the differences identified, React determines the most efficient way to update the real DOM. Only the parts of the real DOM that need to be updated are changed, rather than re-rendering the entire UI.

Step 5: Update to the Real DOM:

finally, React applies the necessary changes to the real DOM. This might involve adding, removing, or updating elements based on the differences detected in step 3.

# The Virtual DOM and Shadow DOM Are the Same

Reality: The virtual DOM and shadow DOM are not the same thing. The virtual DOM is a lightweight copy of the Real DOM with which React optimize UI updates. On the other hand, shadow DOM is a browser technology used to encapsulate the styles and structure of web components.

# Prop drilling

In React, prop drilling refers to passing data via props through multiple layers of nested components. Props are useful for basic data sharing between a component and its children.

# What is React Context API?

Context API in React is used to share data across the components without passing the props manually through every level. It allows to create global state of data providing global access to all the components.

# Why is Context API used?

Context API solves the problem of prop drilling in React. Prop Drilling occurs when data is to be passed between mutliple layers before finally sending it to the required component. This makes the application slower. This problem is solved by Context API as its creates global variables to be used throughout the application without any middle components involved.

# Working of Context API ?

To work with Context API we need React.createContext. It has two properties Provider and Consumer. The Provider acts as a parent it passes the state to its children whereas the Consumer uses the state that has been passed.

import { createContext } frpm "react";

const AuthContext = createContext({null});

const AuthProvider = ({ children }) => {
  const [count,setCount] = React.useState(0);

  return(
    <AuthContext.Provider value={{ count, setCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

 The Context API consists of three main parts: the Context object, the Provider component, and the Consumer component.

 1) Context Object: This is created using React's createContext() function. It holds the data you want to share and comes with two built-in components: Provider and Consumer.

 2) Provider Component: This component wraps the part of the Component tree that needs access to the context data. It accepts a value prop where you pass the data you want to share.

 3) Consumer Component: This component subscribes to the context changes. It's used in any component that needs to consume the data provided by the Provider component.


# SSR (Server Side Rendering) in React

SSR in React is a technique that involves rendering React Components on the server side instead of the client side (browser). Traditionally, React applications are rendered on the client side, meaning that the browser downloads the JavaScript bundle, executes it, and renders the UI. On the other hand with SSR, the server pre-renders the React components into HTML before sending it to the client.

Benefits of SSR:-

1) Improved Initial Page Load Performance
2) Search Engine Optimization (SEO)
3) Enhanced User Experience
4) Support for Browsers with Limited JavaScript

# Code Splitting in ReactJs 

Code Splitting is the process of splitting the entire code into various chunks. Those chunks can get loaded whenever they are needed.

As the code of the application grows, it increases complexity also. It results in an increase in JavaScript files and a huge third-party library size.

To avoid this requirement of downloading various files, the developer can split the script into smaller files. Those files can get loaded when code inside that file is needed. For this, developers prefer the lazy-loading method. This method gets executed when the page or application is interactive and improves the overall performance of an application.

# How does error boundaries work in React ?

Error boundaries are React Components that catch javascript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed.

It catches errors during rendering, in lifecycle methods etc.

Error boundaries do not catch errors for the following events:

1) Event Handlers
2) Asynchronous Code
3) Server-Side Rendering
4) Errors are thrown in the error boundary itself (rather than its children)
5) Hooks cannot be used inside it

# What is the concurrent mode in React ?

Concurrent Mode is a feature in React that allows for more responsive user interfaces by breaking down the rendering work into smaller chunks and prioritizing which parts of the UI to render first.

It was introduced in React 16.

Concurrent Mode enables React to pause, abort, or resume rendering updates based on their priority, thus ensuring that high-priority updates, such as user interactions or animations, are processed without delay, while lower-priority updates can be deferred or interrupted to prevent blocking the main thread.

Concurrent mode is a new feature introduced in React v18 to help tackle the performance issue. It uses an algorithm called the Time Slicing technique that breaks the user interface into smaller, prioritizes chunks, which get rendered by order of importance, thereby increasing the response time for user interactions with the interfaces.

It comes with several APIs such as useMutableSource, useDeferredValue, and useTransition, among others.

# Render Props

Render Props in React is a technique used to share code between React components using a prop whose value is a function.

Child component takes render props as a function and calls it instead of implementing its own render logic

# Dynamic Import

Dynamic Import in React allow you to dynamically load JavaScript modules at runtime, which can significantly improve your application's performance and load times. This technique is particularly useful for code splitting and lazy loading, ensuring that only the necessary code is loaded when needed.

The import() functions returns a promise that resolves to the module you want 

# Default Export

The export default syntax allows you to export a single value from a module as the default export. When another module imports the module that uses export default, the imported value will be whatever value was exported as the default. You can only have one default export per module.

In summary, export default and export with named exports are two ways to export code from a JavaScript module. export default is used to export a single value as the default export, while export with named exports is used to export multiple values as named exports. The choice between the two syntaxes depends on your specific needs for code organization and reusability.

# UseCallback

The callback function is cached and does not get redefined on every render. This will optimize and improve the overall performance of application.

When we define a function inside a component, it is recreated on every render, even if the component's state or props have not changed. This can lead to unnecessary re-renders, which can slow down our application's performance. The useCallback function helps us to avoid this problem by memoizing the function and only recreating it when necessary.

Memoization is an optimization technique that stores results from a computational event in the cache , and on subsequent calls, it fetches the results directly from the cache without recomputing the result.

Syntax:-

useCallback(function, dependencies)

The first argument is the function you want to memoize.

The second argument is an array of dependencies. The elements in this array are the values on which the function to be memoized depends. If any of these values change, the function will be recreated.

The major difference between the useCallback and useMemo hooks is that the useCallback returns a memoized function while the useMemo returns a memoized value.

Benefits of using the useCallback hook

1) Performance optimization

   This hook optimizes the performance of your application by preventing a series of unnecessary re-rendering in our components.

2) Restricting rendering of child components

   The useCallback hook in React allows us to selectively render important child components in a parent component. By using the useCallback hook, we can create memoized functions and pass them as props to child components. This ensures that only the necessary child components are rendered and updated when specific actions occur, resulting in improved performance.
   
3) Preventing memory leaks

   Since the hook returns the memoized function, it prevents recreating functions, which can lead to memory leaks.

# React.strictmode

<StrictMode> lets you find common bugs in your components early during development.

Usage:-

Enabling Strict Mode for entire app
Enabling Strict Mode for a part of the app
Fixing bugs found by double rendering in development
Fixing bugs found by re-running Effects in development
Fixing deprecation warnings enabled by Strict Mode

# Portals

Portals in React provide a powerful and flexible way to render components outside of their usual DOM hierarchy. By leveraging portals, developers can create modal dialogs, tooltips, context, menus, and more, without sacrificing the benefits of React's component architecture.

# What is lazy loading in React ?

Lazy loading in React is a performance technique that delays the loading of components or resources(like images, videos, or other assets) until they are actually needed. It helps improve the initial load time of the application by splitting the code into smaller chunks and only loading the necessary parts at a given time.

Why Use Lazy loading ?

1) Faster Initial Load
2) Improves Performance
3) Better User Experience

# How does Hydration work in React ?

Hydration in React is the process of making a server-rendered HTML page fully interactive by "attaching" React's JavaScript components and event handlers to the static HTML elements in the browser.

# Difference between useState and setState in React ?

In React, useState and setState are both used to manage state in components, but they belong to different types of components and have some key differences.

1) useState

useState is a React Hook that is used to manage state in Functional components. React Hooks, including useState, were introduced in React 16.8 to allow state and other React features to be used in functional components, which previously could only be used in class components.

Syntax: 

const [state,setState] = useState(initialState);

initialState: The initial value for the state (can be any type like a number, string, array, object, etc).

state: The current value of the state.

setState: A function that you call to update the state.

2) setState

setState is a method used in class components to manage and update state. It is part of the React component lifecycle and allows you to change the state of the component and trigger a re-render.

Syntax:

this.setState({ key: value });

key: The state variable name.

Value: The new value for the state variable.

# React LifeCycle Method:

In React, lifeCycle methods are special methods that get invoked at different stages of a component's existence, from its creation to its destruction. These methods are primarily used in class components to manage state, interact with external APIs, and handle component updates and cleanup.

A React Component has three different phases in its lifecycle, including mounting, updating, and unmounting.

Each phase has its own methods which are responsible for a particular stage in a component's lifecycle.

These methods are for class-based components, functional component has their own life cycle methods.

1) Mounting Phase,

The mounting phase is when a new component is created and it is inserted into the DOM. This happens once, and is often called "initial render".

To get through this phase, four lifecycle methods are called: constructor, static getDerivedStateFromProps, render, and componentDidMount.

Mounting -> Constructor() -> static getDerivedStateFromProps -> render() -> componentDidmount()

The constructor() Method

The constructor method is the very first method called during the mounting phase. 

This method is mostly used for initializing the state of the component and binding the event-handler methods which will be used within the component.

The constructor method is called when the component is initiated, but before ;

If you want any state in your component, it's important you call super(props) function within the props as an argument passed to it within the constructor.

The static getDrivedStateFromProps() method:-

After initilizing, the next function that is called static getDerivedStateFromProps().

This method is used to modify the state value with any props value. The method static getDerivedFromProps() accepts two arguments. props and state, and returns an object, or null if no change is needed. These values are passed directly to the method, so there's no need for it have access to the instance of the class and thus is considered a static method.

The render() method.

The render method is the only required method for a class-based React Component. It's called after the getDerivedStateFromProps() method and actually renders or inserts all HTML into the DOM.

Typically, the render method returns the JSX which will eventually be rendered, but it can also return other values. You can't modify the state, have any direct interaction with the browser, or any other kind of side effect like sending an HTTP request in the render method. 

The componentDidMount() method

This method is executed immediately after the component is rendered for the first time that is after the first render() cycle.

This method is mostly used to handle all the network requests such as API calls or to set up all the major subscriptions of the application.

Updating Phase:-

The updating phase is when the component has any updates or it re-renders. This phase is triggered when the props or state are updated.

It can also be triggered when a component consists of the following methods:-

static getDerivedStateFromProps(), shouldComponentUpdate(), render(), getSnapshotBeforeUpdate(), and componentDidUpdate().

The shouldComponentUpdate Method

This is also another rarely used lifecycle method. It's specifically use for performance optimization. This method gives you control over whether or not a component should update due to a change in its props or state. By default, a component will always re-render when the state or prop is updated. This method can either return a true or false, to determine if the component should be updated or not. Also, this method receives nextProps and nextState as arguments so you can always compare it with the component's current prop and state values.

The getSnapshotBeforeUpdate Method

The getSnapShotBeforeUpdate() method is called right before the changes from the current update are applied to the DOM. The value you return from this method will be passed as the third parameter to the componentDidUpdate() method. This method is called after the render method, and before componentDidUpdate. This is also one of those methods that are rarely used.

The componentDidUpdate Method

This method is the last one invoked in this phase. Like the previous method, it also receives the older props and state values as arguments but it also receives the return value getSnapshotBeforeUpdate() as a third argument.

It is typically used to make fetch requests based on the condition of comparing the previous and current props and state values. Therefore, you may call setState but it should be within the conditional statement.

Unmounting Phase

The unmounting phase is the last stage in the lifecycle of a React component. This phase refers to when a component is removed from the DOM and is no longer rendered or accessible. During this phase, React performs a series of cleanup operations to ensure that the component and its associated resources are properly cleared of the DOM tree.

This can happen for various reasons, such as when the component is no longer needed, the parent component is re-rendered without including the child component, or when the application is navigating to a different page or view. It has only one method,

The componentWillUnmount() lifecycle method

This method is called just before the component is removed from the DOM. It allows you to perform any necessary cleanup, such as canceling timers, removing event listeners, or clearing any data structures that were set up during the mounting phase. All of the component's state and props are destroyed.

