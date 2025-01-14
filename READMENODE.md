# What are Template Literals?

Template literals are a feature in JavaScript that were introduced With ES6. They give you a more flexible and maintainable way of working with strings in JavaScript. We denote strings using backticks ``.

Can be used in multiline string, readability, for creating dynamic mysql queries, localization and internalization

Template literals provide a convenient way to work with strings in JavaScript.

# Explain NaN and how to check it?

In JavaScript , NaN is a property of the global Object. In Other words, it is a variable available in the Global scope. it stands for Not-A-Number but its type is number.

console.log(typeof(NaN)) // "number"

It never equals to itself, So NaN == NaN or NaN === NaN is always false.

Problem solved with Number.isNaN

That's why the Number.isNaN methods was introduced! It solves the isNaN false positive problem. Number.isNaN doesn't do any coercion.
In other words, it doesn't try to convert the argument's type to a Number type.

# Type Coercion

Type Coercion is the process of converting value from one type to another (such as string to number, object to boolean and so on.)

Type coercion can be implicit and explicit

Implicit (Automatically done during code execution)

Explicit (Done by the developer)

example:-

const sum = 1 + "JavaScript"

This is practically possible to add number with string, As JavaScript is a weakly typed language. Instead of JavaScript throwing an error, it coerces the type of one value to fit the type of the other value so that the operation can be carried out.

In this case, using the +sign with a number and a string, the number is coerced to a string, then the +sign is used for a concatenation operation.

Look at another example below:

const times = 35 * "hello"

console.log(times)
// NaN

Here, we use times * for a number and a string. There's no operation with strings that involves multiplication, so here, the ideal coercion is from string to number (as numbers have compatible operations with multiplication).

But since a string (in this case, "hello") is converted to a number (which is NaN) and that number is multiplied by 35, the final result is NaN.

# Prototype Chain

Every object in JavaScript has a built-in property, which is called its prototype. The prototype is itself an object, so the prototype will have its own prototype , making what's called a prototype chain. 

The chain ends when we reach a prototype that has null for its own prototype.

Note: The property of an object that points to its prototype is not called prototype.

https://www.dhiwise.com/post/prototype-chains-in-javascript-understanding-advanced-techniques

# Throttling

Throttling is a technique that limits how often a function can be called in a given period of time.

It is useful for improving the performance and responsiveness of web pages that have event listeners that trigger heavy or expensive operations.

Throttling can be implemented in JavaScript using timer functions such as setTimeout or setInterval.

Throttling is suitable for scenarios where you want to limit how often a function can be called, but you don't want to miss any calls.

# Debouncing

Debouncing is a way of delaying the execution of a function until a certain amount of time has passed since the last time it was called.

This can be useful for scenarios where we want to avoid unnecessary or repeated functions calls that might be expensive or time-consuming.

For example., 

Imagine we have search box that shows suggestions as the user types. If we call a function to fetch suggestions on every keystroke, we might end up making too many requests to the server, which can slow down the application and waste resources. Instead we can use debouncing to wait until the user has stopped typing for a while before making the request.

# Number.isNaN()

Number.isNaN() doesn't attempt to convert the parameter to a number, so non-numbers always return false.

For example:-

Number.isNaN("NaN");
Number.isNaN(udefined);
Number.isNaN({});
Number.isNaN("blabla");
Number.isNaN(true);
Number.isNaN(null);
Number.isNaN("37");
Number.isNaN("37.37");
Number.isNaN("");
Number.isNaN(" ");

# Difference between Number.isNaN() and global isNaN()

Number.isNaN() doesn't attempt to convert the parameter to a number, so non-numbers always return false.

The global isNaN() coerces its parameter to a number.

for example:-

isNaN("NaN"); // true
isNaN(undefined); // true
isNaN({}); // true
isNaN("blabla"); // true
isNaN(true); // false, this is coerced to 1
isNaN(null); // false, this is coerced to 0
isNaN("37"); // false, this is coerced to 37
isNaN("37.37"); // false, this is coerced to 37.37
isNaN(""); // false, this is coerced to 0
isNaN(" "); // false, this is coerced to 0

# Event bubbling & Event Capturing

In Event bubbling, the event starts at the most from the target, then bubbles up, triggering handlers on its parent elements upwards till it reaches the top of the DOM tree. It's like a bubble rising to the surface of the water.

On the other hand, event capturing is the exact oppposite. The event starts at the top of the DOM tree and descends down to the target, triggering handlers as it goes. It's like a diver plunging into the depths of the sea.

# onClickCapture and onClick event

React onClickCapture is an event handler that gets triggered whenever we click on an element. like onClick, but the difference is that onClickCapture acts in the capture phase whereas onClick acts in the bubbling phase i.e. phases of an event.

Any event handler can stop the event by calling the event.stopPropagation().

# preventDefault() vs stopPropagation()

preventDefault is used to prevent the default action associated with an event from occurring. For example, clicking a link navigates to a new page, and submitting a form refreshes the page. If you want to prevent these default actions from happening, you'd use preventDefault.

On the other hand, stopPropagation is used to stop an event from bubbling up the DOM tree. It doesn't prevent the default action associated with the event. Instead, it prevents the event from triggering handlers on parent elements.

# Web Workers

Web workers are background threads in JavaScript that execute code independently of the main thread. The are deisgned to offload tasks that can be time-consuming or resource-intensive, such as Complex computations, data processing, or heavy rendering.

# Advatange of using Web Workers

1) Improved Performance: By moving resource-intensive tasks to a separate thread, Web Workers prevent the main thread from becoming blocked.

2) Parallel Processing: Web Workers enable parallel processing, allowing multiple tasks to be executed simultaneously. This can speed up operations.

# Scenarios Where Web Workers Are Useful

1) Data Processing
2) Real-time Applications
3) Multithreading

For Example code:-

// Create a new Web Worker
const worker = new Worker('worker.js');

// Define a message handler for the Web Worker
worker.onmessage = function(event) {
  // This function is called when the worker sends a message back
  console.log('Received message from Web Worker:', event.data);
}

// Send a message to the Web Worker
worker.postMessage('Hello from the main script');

Web Workers are used to offload CPU-intensive tasks from the main thread, while Service Workers are used to intercept network requests and provide offline support and push notifications.

# Observer Pattern

Use observables to notify subscribers when an event occurs.

With the observer pattern, we have:

1) An observable object, which can be observed by subscribers in order to notify them
2) Subscribers, which can subscribe to and get notified by the observable object.

# Object Mutation

Object mutation occurs when an object is modified directly. This can happen when you change the value of a property or add a new property to an object. For example:-

const person = {
  name: "Ganesh",
  age: 32
};

person.age = 31;

In this code, we are modifying the age property of the person object directly.

# Why Avoid Object Mutation

Object mutation can lead to unexpected behaviour and bugs in your code. When you modify an object directly, it can affect other parts of your code that rely on that object. This can make it difficult to debug your code and can be lead to hard-to-find bugs.

# How to Avoid Object Mutation

There are several ways to avoid object mutation in JavaScript.

1) Use const and let instead of var

When declaring variables in JavaScript, it's best to use const and let instead of var. This is because const and let are block-scoped, which means they are only accessible within the block they are declared in. This makes it easier to avoid accidentally modifying objects.

2) Use Obect.assign()

The object.assign() method can be used to create a new object that is a copy of an existing object. This method takes two or more objects as arguments and returns a new object that contains all the properties of the original objects.

for example:-

const person = {
  name: "Ganesh",
  age: 32
};

const newPerson = Object.assign({},person);

newPerson.age = 33;

In this code, we are creating a new object called newPerson that is a copy of the person object. We are them modifying the age property of the newPerson object instead of the original person object.

3) Use the Spread Operator

The spread operator (...) can also be used to create a new object that is a copy of an existing object.

const person = {
  name: "Ganesh",
  age: 32
}

const newPerson = {...person};

newPerson.age = 33;

In this code, we are creating a new object called newPerson that is a copy of the person object using the spread operator. We are then modifying the age property of the newPerson object instead of the original person object.

4) Use Object.freeze()

The Object.freeze() method can be used to freeze an object so that it cannot be modified. When an object is frozen, you cannot add or remove properties from it, and you cannot modify its existing properties.

For example:-

const person = {
  name: 'John',
  age: 30,
};

Object.freeze(person);

person.age = 31; // This will not work

In this code, we are freezing the person object using the Object.freeze() method. We are then attempting to modify the age property of the person object, which will not work because the object is frozen.

# Garbage Collections in JavaScript

Garbage collection in JavaScript is an automatic process managed by the JavaScript engine, designed to reclaim memory occupied by objects that are no longer needed. This helps prevent memory leaks and optimizes the use of available memory.

# Memory Management basics

JavaScript allocates memory for objects, array, and other variables as they are created. Over time, some of these objects become unreachable because there are no references to them. Garbage collection is the process of identifying these unreachable objects and reclaiming their memory.

# Memory Leak

Memory leaks in JavaScript occur when a program fails to release memory that it no longer needs, causing the program to consume more and more memory over time.

Memory leaks in JavaScript can occur due to various reasons, including:

1) Accidental global varaibles: Unintenionally creating global variables that remain in memory event after they are no longer needed.
2) Closures: Improper use of closures, where an inner function retains references to variables from an outer function's scope, preventing the outer function's scope from being garbage collected.
3) Event listeners: Failing to remove event listeners or callbacks when they are no longer needed, causing the associated objects to remain in memory.
4) Caching: Implementing caches without proper eviction logic, leading to unbounded and memory growth over time.
5) Forgotten timers or callbacks: Failing to clear timers or callbacks when they are no longer needed, causing their associated data to remain in memory.

To avoid leaking memory:

1) Remove event listeners: Always remove event listeners when they are no longer needed.
2) Clear references in closures: Avoid holding unnecessary references in closures.
3) Manage DOM references: Explicitly remove DOM nodes and their references when they are no longer needed.
4) Avoid global variables: Minimize the use of global variables to reduce the risk of inadvertently keeping references alive.

# Proxy Object

The Proxy object allows you to create an object that can be used in place of the original object, but which may redefine fundamental object operations like getting, setting, and defining properties.

Proxy objects are commonly used to log property accesses, validate, format, or sanitize inputs, and so on.

You create a Proxy with two parameters:

target: the original object which you want to proxy.
handler: an object that defines which operations will be intercepted and how to redefine intercepted operations.

for example:-

const target = {
  message1: "Hello",
  message2: "Everyone
}

const handler1 = {};

const proxy1 = new Proxy(target,handler1);

Because the handler is empty, this proxy behaves just like the original target:

console.log(proxy1.message1); // hello
console.log(proxy1.message2); // everyone

To customize the proxy, we define functions on the handler object:

const target = {
  message1: "hello",
  message2: "everyone",
};

const handler2 = {
  get(target, prop, receiver) {
    return "world";
  },
};

const proxy2 = new Proxy(target, handler2);

Proxy are often used with the Reflect object, which provides some methods with the same names as the Proxy traps. The Reflect methods provide some methods with the same names as the proxy traps.

# JavaScript Generators

JavaScript Generators are special functions that can be paused and resumed during execution. They use the yield keyword to produce a sequence of values lazily, allowing for a more flexible control flow.

# Event Loop

Event loop is a mechanism in JavaScript that handles asynchronous operations by continously checking the message queue for pending tasks and executing them when the call stack is empty, ensuring non-blocking behavior.

How Event Loop works in JavaScript

The Event Loop continuously checks the call stack and message queue. When the call stack is empty, it takes the first task from the message queue and pushes it onto the stack for execution. 

Components of Event Loop

The main components are the Call Stack, Task Queue(Callback Queue), and the Event Loop.

The Call Stack manages the execution context, 
the Task Queue stores callbacks and messages for asynchronous operations, and 
the Event Loop manages the flow of tasks between the Call Stack and the Task Queue.

How does the Event Loop handle asynchronous operations in JavaScript

Asynchronous operations in JavaScript are handled by placing their callbacks in the Task Queue. When the call stack is empty, the Event Loop checks the Task Queue and moves callbacks onto the call stack for execution.

What is the difference between the Call Stack and the Task Queue in JavaScript

The Callstack is responsible for managing the execution context of synchronous code, while the Task Queue (Callback Queue) stores callbacks and messages for asynchronous operations.

How does the Event Loop help in preventing blocking in JavaScript

The Event Loop enables JavaScript to handle asynchronous tasks without blocking the main thread. It ensures that the main thread remains responsive by offloading long-running tasks to the background and handling their completion asynchronously.

Difference between the microstask queue and the task queue in JavaScript

Both queues are used to store callbacks, but the microtask queue(also known as Job Queue) has a higher priority and is processed before the task queue. Microtasks typically include Promises, whereas the task queue includes other asynchronous tasks like setTimeout callbacks.

How Event Loop handle concurrency in JavaScript

JavaScript's concurrency model is based on the Event Loop. It allows asynchronous tasks to be executed without blocking the main thread by offloading them to the Task Queue and processing them when the call stack is empty.

https://medium.com/@a35851150/interview-qustions-on-event-loop-in-js-901c567a1271

# Hoisting

In JavaScript, hoisting is a behaviour in which a function or a variable can be used before declaration.

For example:-

// use test variable before declaring
console.log(test);

// declare and initialize test variable
var test = 5;

// Output: undefined

Hoisting in JavaScript

Two types:-

Variable and Function hoisting

Variable Hoisting:-

In JavaScript, the behavior of hoisting varies depending on whether a variable is declared using var, let, or const.

Hoisting With 'var'

When we declare a variable using var, it is hoisted to the top of its current scope. For example,

// use the message variable before declaration
console.log(message);

// variable declaration using var keyword
var message;

// Output: undefined

In the above example, we can use the message variable before it is declared. This is because the variable is hoisted with the default value of undefined.

Thus, the above program is equivalent to:

var message;
console.log(message);

// Output: undefined

Hoisting With 'let' and 'const'

When we declare a variable using let or const, it is hoisted to the top of its current scope. However, the variable does not have a default value when it is hoisted (unlike when declared using var).

// use the message variable before declaration
console.log(message);

// variable declaration using let keyword
let message;

output : ReferenceError: Cannot access 'message' before initialization

Function Hoisting:-

In JavaScript, fnction hoisting allows us to call the function before its declaration.

// function call
greeting(); 

// function declaration
function greeting() {
  console.log("Welcome to Programiz.");
}

# Difference between promise and async await in Node.js ?

Promises and async/await are both constructs in JavaScript used for handling asynchronous operations.

Promises:

A Promise is an object representing the eventual completion or failure of an asynchronous operation. 

It has three states: pending, fulfilled, and rejected. A promise can be in the pending state, indicating that the asynchronous operation is ongoing; fulfilled when the operation is successful; or rejected if there was an error.

For example:-

function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = 'Async data';
      // Simulating a successful operation
      resolve(data);
      // Simulating an error
      // reject('Error fetching data');
    }, 1000);
  });
}
fetchData()
  .then((result) => {
    console.log('Promise resolved:', result);
  })
  .catch((error) => {
    console.error('Promise rejected:', error);
  });

Explanation:

The fetchData function returns a Promise that resolves after a simulated asynchronous operation (e.g., fetching data from a database or an API).
The .then method is used to handle the successful resolution of the promise.
The .catch method is used to handle any errors that may occur during the promise execution.

# Async/Await:

async/await is a syntactic sugar built on top of promises. It allows writing asynchronous code in a more synchronous manner, making it easier to read and maintain. The async keyword is used to define a function that returns a promise implicitly. The await keyword is used within an async function to pause execution until the promise is resolved or rejected.

# Syntactic Sugar

Syntactic sugar is a term for a more concise syntax that provides the same functionality for something that already exists. It aims to help make code shorter, therefore , easier to write.

Syntactic sugar is a term for shorter syntax that achieves functionality that already exists. This means syntactic sugar does not provide any new functionality, but it does make code a little sweeter and easier to work with. The for...of loop and destructuring are examples of syntactic sugar in JavaScript that help us write concise code.

# What will [2] == [2] return and why ?

This expression will return false. This is because, in JavaScript , arrays are objects and objects are compared by reference, not by value. Each array literal creates a new reference, so they are not equal, even if their contents are same.

# What does 0.1 + 0.2 === 0.3 evaluate to and why ?

This expression evaluates to false in JavaScript. The reason is the floating point numbers are respresented in binary, as per the IEEE 754 standard. Both 0.1 and 0.2 cannot be exactly represented in binary, and the rounding errors from the approximations lead to a sum that is not exactly equal to 0.3. Therefore, 0-1 + 0.2 ends up being a number very close to but not exactly 0.3, making the expression false.

# What does the instanceof operator do ?

The JavaScript instanceof operator is used to check the type of an object at the run time. It returns a boolean value(true or false). The operator returns a Boolean value that indicates whether the object inherits from a certain class or not.

# hasownproperty method

This method is used to check whether the property on an object belongs to the mentioned object or not. If property belongs to the mentioned object then it will return true else it will return false.

# Guess the output of value ?

let x = 1;

if (function f() {}) {
  x += typeof f;
}

console.log(x);

Answer - 1undefined

The if statement is evaluating the function f as a boolean value. In JavaScript, functions are truthy values, so the condition will evaluate to true and the code block inside the if statement will be executed. The value of x is then incremented by the string "undefined", which is the result of calling typeof f.

# What is JavaScript Object Literal

JavaScript Object Literal is a data type used to define objects in JavaScript. It is syntax for creating an object in JavaScript that is composed of key-value pairs. It is lightweight and efficient way to create and store data.

# Temporal deadZone

The Temporal Dead Zone is a concept introduced in ECMAScript 2015 (ES6) as part of the let and const variable declarations. It is a specific region within a scope where variables exist but cannot be accessed until they are assigned a value. This zone starts at the beginning of the scope and continues until the point of declaration.

# Hoisting

Hoisting is a javascript mechanism where variable and function declarations are moved to the top of their respective scopes during the compilation phase. This means that variables can be accessed and used before they are decalared. 

However, it is important to note that only the declarations are hoisted, not the initializations. Variables declared with the var keyword are hoisted to the top of their scope and have an initial value of undefined until they are assigned a specific value.

On the other hand, variables declared with let and const are also hoisted, but they remain in the TDZ until their declaration is reached in the code execution flow.

# What is Variable Shadowing ?

Variable shadowing is when a variable with same name is declared in an inner scope as a variable in an outer scope. In such cases, the variable in the inner scope hides the variable in the outer scope. Any references to the variable within the inner scope will refer to the inner variable, effectively "shadowing" the outer variable.

Fo example:-

Javascript code
let x = 10;

function foo() {
  let x = 20;
  console.log(x);
}

foo();
console.log(x);

In this example, we have two variables named x. The outer x has a value of 10, while the inner x has a value of 20. When we call the foo function, it logs 20 to the console, which is the value of the inner x. However, when we log x outside the function, it refers to the outer x and thus logs 10 to the console.


# this keyword

The this keyword is a reference to an object, but the object varies based on where and how it is called.

In non–strict mode, this is always a reference to an object. In strict mode, it can be any value. 

this in Different Contexts

1) Default/Global Context

When a function is called in the global scope, without any object reference, the 'this' keyword refers to the global window object. This is called default binding.

function greet() {
  console.log(this); // refers to global window object
}

greet();

In this example, the function 'greet' is called without any object reference, and hence 'this' refers to the global window object.

2) Implicit binding

When a function is called as a method of an object, the 'this' keyword refers to the object itself. This is called implicit binding.

const person = {
  name: 'John',
  greet: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

person.greet(); // Hello, my name is John

In the above example, the function 'greet' is called as a method of the 'person' object, and hence 'this' refers to the object 'person'.


3) Explicit binding

We can also explicitly bind the value of 'this' using call(), apply(), and bind() methods. These methods allow us to call a function in a specific context by passing an object as an argument.

function greet() {
  console.log(`Hello, my name is ${this.name}`);
}

const person1 = { name: 'John' };
const person2 = { name: 'Mary' };

greet.call(person1); // Hello, my name is John
greet.apply(person2); // Hello, my name is Mary

const greetJohn = greet.bind(person1);
greetJohn(); // Hello, my name is John

In the above example, we define a function 'greet' that logs a message using the 'this' keyword. We then create two objects 'person1' and 'person2'. We use the call() and apply() methods to bind the value of 'this' to the respective objects and call the function 'greet'. We also use the bind() method to create a new function 'greetJohn' that is bound to the object 'person1' and call it later.

4) Arrow functions and 'this'

Arrow functions behave differently than regular functions when it comes to 'this' binding. In an arrow function, 'this' always refers to the value of 'this' in the enclosing lexical scope, regardless of how it is called.

const person = {
  name: 'John',
  greet: function() {
    const message = () => console.log(`Hello, my name is ${this.name}`);
    message();
  }
}

person

In the above example, we define an object 'person' with a method 'greet'. Inside the method, we define an arrow function 'message' that logs a message using the 'this' keyword. Since the arrow function is defined inside the method, it captures the value of 'this' from the enclosing lexical scope, which is the object 'person'.

unlike normal functions in arrow functions the value of this does not depend on the way a function is called.

Additionally, arrow functions inherit their scope from the parent function, in this case, the window or the global object, rather than binding the function themselves.

# IIFE (Immediately Invoked Function Expression)

In JavaScript, an IIFE is a powerful and widely used pattern that allows you to create and execute a function immediately after its definition. This pattern encapsulates code within its own scope, preventing variable pollution in the global scope and enabling more controller and modular code organization.

for example:-

(function() {
  // IIFE code goes here
})();

# Higher Order Function 

A higher order function is a function that takes one or more functions as arguments, or returns a function as its result.

There are several different types of higher order functions like map and reduce.

for example:-

// Callback function, passed as a parameter in the higher order function
function callbackFunction(){
  console.log('I am  a callback function');
}

// higher order function
function higherOrderFunction(func){
  console.log('I am higher order function')
  func();
}

higherOrderFunction(callbackFunction);

# Shallow Copy vs Deep copy

There are two ways to clone an object in Javascript:

Shallow copy: means that only the first level of the object is copied. Deeper levels are referenced.

Deep copy: means that all levels of the object are copied. This is a true copy of the object.

# Shallow copy

A shallow copy can be achieved using the spread operator (…) or using Object.assign().

# Deep copy

A deep copy, creates a completely new object or array and recursively copies all nested objects and arrays found in the original.
This means that any changes made to the deep copy do not affect the original structure.

# Primitive Date types

Boolean
null
undefined
string
Number
Bigint
Symbol

Primitives are immutable (they do not have methods or properties that can alter them)

All primitives in any programming language are passed by value and all non-primitives are passed by reference

# Closure

A Closure is the combination of a function and the lexical environment within which that function was declared.
This environment consists of any variables that were in-scope at the time the closure was created.

# Difference between Arrow and Regular Function 

No arguments object in arrow functions (A normal function has an arguments object which you can access in the function)

Arrow functions do not create their own this binding (In normal functions, a this variable is created which references the Obects that call them)

Arrow functions cannot be used as constructors (With normal functions, you can create constructors which serve as a special function for instantiating an object from a class)

Arrow functions cannnot be declared (Normal functions can be declared when you use the function keyword and a name, but arrow functions cannot be declared)

Arrow functions cannot be accessed before initialization

Hoisting is a concept where a variable or function is lifted to the top of its global or local scope before the whole code is executed.
This makes it possible for such a variable/function to be accessed before initialization.

# Fetch API

Node.js Fetch API is a built-in module in Node.js that enables developers to make API requests and handle responses on the server.
It also provides a simple way to set and retrieve HTTP headers and allows us to customize requests with options such as the request
method, headers, and body.

fetch()

The fetch() method takes a required parameter, i.e., API endpoint URL, and an object as a second parameter that can be used to 
customize the request, such as setting headers, request method, or body.

# ES6 modules

ES6 modules are JavaScript modules that are used to import and export functions, objects, or primitive values from one file to another.

Everything inside an ES6 modules is private by default. There is no need for `use strict` as everything is already in strict mode.
To make a variable or function public, the `export` feature is used. This allows other modules to import it.

# Difference between Common JS and ES6 modules

Common JS is the original and default module system of Node.js. It uses require and module.exports 


Importing ES6 modules

ES6 uses import and export. This means you only load the modules that you need, and the importing of the modules is asynchronous.

