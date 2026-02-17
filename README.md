# swiftCart

## 1️⃣ Difference between `null` and `undefined`

- **`null`**:
 represents the intentional absence of any object value
it indecates no value for a variable

- **`undefined`**:
represents that a variable has been declared but not assigned a value
js automatically assigns undefined to uninitialized variables

---

## 2️⃣ `map()` function and difference from `forEach()`

- **`map()`**:
 it is used to transform each element in an array and returns a new array
it does not modify the original array

- **`forEach()`**:
  it is used to iterate over array elements
  returns undefined does not produce a new array
---

## 3️⃣ Difference between `==` and `===`

- **`==` (Equality)**:
  compares value only
  it also performs type coercion

- **`===` (Stricrt Equality)**:
  compares both value and type
  no type coercion

---

## 4️⃣ Significance of `async/await` in fetching API data
- it allows writing asynchronous code in a synchronous style
- async function always returns promise
- await stops the execution of the function until the promise resolves

## 5️⃣ Concept of Scope in JavaScript
it determines the accessibility of variables in different parts of the code
global scope: variables declared outside any function or block and accessible anywhere in the code
function scope: variable declared inside a function is accessible only within that function
blick scope:  variables declared with let or const inside {} are accessible to that block only
