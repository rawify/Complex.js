# Complex.js - ℂ in JavaSript

[![NPM Package](https://img.shields.io/npm/v/complex.js.svg?style=flat)](https://npmjs.org/package/complex.js "View this project on npm")
[![Build Status](https://travis-ci.org/infusion/Complex.js.svg?branch=master)](https://travis-ci.org/infusion/Complex.js)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Complex.js is a JavaScript library to work with complex number arithmetic in JavaScript. It implements every elementary complex number manipulation function and the API is intentionally similar to [Fraction.js](https://github.com/infusion/Fraction.js). 


Example
===
  
```js
var Complex = require('complex.js');

var c = new Complex("99.3+8i");
c.mul({r: 3, i: 9}).div(4.9).sub(3, 2);
```

Parser
===

Any function (see below) as well as the constructor of the *Complex* class parses its input like this.

You can pass either Objects, Doubles or Strings.

Objects
---
```javascript
new Complex({r: real, i: imaginary});
new Complex({arg: angle, abs: radius});
```

Doubles
---
```javascript
new Complex(55.4);
```

Strings
---
```javascript
new Complex("123.45");
new Complex("15+3i");
new Complex("i");
```

Two arguments
---
```javascript
new Complex(3, 2); // 3+2i
```

Functions
===

Complex add(n)
---
Adds another complex number

Complex sub(n)
---
Subtracts another complex number

Complex mul(n)
---
Multiplies the number with another complex number

Complex div(n)
---
Divides the number by another complex number

Complex pow(exp)
---
Returns the number raised to the complex exponent

Complex sqrt()
---
Returns the complex square root of the number

Complex exp(n)
---
Returns `e^n` with complex exponential.

Complex log()
---
Returns the natural logarithm (base `E`) of the actual complex number

double abs()
---
Calculates the magnitude of the complex number

double arg()
---
Calculates the angle of the complex number

Complex sin()
---
Calculates the sine of the complex number

Complex cos()
---
Calculates the cosine of the complex number

Complex tan()
---
Calculates the tangent of the complex number

Complex sinh()
---
Calculates the hyperbolic sine of the complex number

Complex cosh()
---
Calculates the hyperbolic cosine of the complex number

Complex tanh()
---
Calculates the hyperbolic tangent of the complex number

Complex asin()
---
Calculates the arcus sine of the complex number

Complex acos()
---
Calculates the arcus cosine of the complex number

Complex atan()
---
Calculates the arcus tangent of the complex number

Complex inverse()
---
Calculates the complex inverse of the number (1 / z)

Complex conjugate()
---
Calculates the conjugate of the complex number (multiplies the imaginary part with -1)

Complex negate()
---
Negates the number (multiplies both the real and imaginary part with -1)

boolean equals(n)
---
Checks if both numbers are exactly the same

Complex clone()
---
Returns a new Complex instance with the same real and imaginary properties

Array toVector()
---
Returns a Vector of the actual complex number with two components

String toString()
---
Returns a string representation of the actual number

```javascript
new Complex(1, 2).toString(); // 1+2i
new Complex(0, 1).toString(); // i
new Complex(9, 0).toString(); // 9
new Complex(1, 1).toString(); // 1+i
```

double valueOf()
---
Returns the real part of the number if imaginary part is zero. Otherwise `null`


Constants
===

Complex.ZERO
---
A complex zero shortcut

Complex.ONE
---
A complex one shortcut

Complex.I
---
The imaginary number i shortcut

Complex.PI
---
A complex PI shortcut

Complex.E
---
A complex euler number shortcut


Installation
===
Installing complex.js is as easy as cloning this repo or use one of the following commands:

```
bower install complex.js
```
or

```
npm install complex.js
```


Coding Style
===
As every library I publish, complex.js is also built to be as small as possible after compressing it with Google Closure Compiler in advanced mode. Thus the coding style orientates a little on maxing-out the compression rate. Please make sure you keep this style if you plan to extend the library.


Testing
===
If you plan to enhance the library, make sure you add test cases and all the previous tests are passing. You can test the library with

```
npm test
```


Copyright and licensing
===
Copyright (c) 2015, Robert Eisele (robert@xarg.org)
Dual licensed under the MIT or GPL Version 2 licenses.
