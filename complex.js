/**
 * @license Complex.js v1.5.0 13/07/2015
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

/**
 *
 * This class allows the manipilation of complex numbers.
 * You can pass a complex number in different formats. Either as object, double, string or two integer parameters.
 *
 * Object form
 * { r: <real>, i: <imaginary> }
 * { re: <real>, im: <imaginary> }
 * { arg: <angle>, abs: <radius> }
 *
 * Double form
 * 99.3 - Single double value
 *
 * String form
 * "23.1337" - Simple real number
 * "15+3i" - a simple complex number
 * "3-i" - a simple complex number
 *
 * Example:
 *
 * var c = new Complex("99.3+8i");
 * c.mul({r: 3, i: 9}).div(4.9).sub(3, 2);
 *
 */

(function(root) {

    "use strict";

    /**
     * Comparision epsilon
     *
     * @const
     * @type Number
     */
    var EPSILON = 1e-16;

    var P = {r: 0, i: 0};

    // Heaviside-Function
    var H = function(x) {
        return x < 0 ? -1 : 1;
    };

    Math.cosh = Math.cosh || function(x) {
        return (Math.exp(x) + Math.exp(-x)) * 0.5;
    };

    Math.sinh = Math.sinh || function(x) {
        return (Math.exp(x) - Math.exp(-x)) * 0.5;
    };

    var parser_exit = function() {
        throw "Invalid Param";
    };

    function logsq2(a, b) {

        if (a < 1000 && b < 1000) {
            return Math.log(a * a + b * b) * 0.5;
        }

        a = Math.abs(a);
        b = Math.abs(b);

        var t = Math.min(a, b);
        a = Math.max(a, b);
        t = t / a;

        return Math.log(a) + Math.log(1 + t * t) * 0.5;
    }

    var parse = function(a, b) {

        if (a === null || a === undefined) {
            P["r"] = 0;
            P["i"] = 0;
        } else if (b !== undefined) {
            P["r"] = (a);
            P["i"] = (b);
        } else
            switch (typeof a) {

                case "object":

                    if ("i" in a && "r" in a) {
                        P["r"] = (a["r"]);
                        P["i"] = (a["i"]);
                    } else if ("im" in a && "re" in a) {
                        P["r"] = (a["re"]);
                        P["i"] = (a["im"]);
                    } else if ("abs" in a && "arg" in a) {
                        P["r"] = a["abs"] * Math.cos(a["arg"]);
                        P["i"] = a["abs"] * Math.sin(a["arg"]);
                    } else {
                        parser_exit();
                    }
                    break;

                case "string":

                    P["i"] = /* void */
                            P["r"] = 0;

                    for (var reg = /[+-]?[\di.]+/g, tmp, tr, i = 0; null !== (tmp = reg.exec(a)); i = 1) {

                        if (tmp[0].indexOf("i") !== -1) {

                            tr = tmp[0].replace("i", "");
                            if (tr === "+" || tr === "-" || tr === "")
                                tr+= "1";

                            P["i"]+= parseFloat(tr);
                        } else {
                            P["r"]+= parseFloat(tmp[0]);
                        }
                    }

                    // No single iteration
                    if (i === 0) {
                        parser_exit();
                    }
                    break;

                case "number":
                    P["i"] = 0;
                    P["r"] = a;
                    break;

                default:
                    parser_exit();
            }

        if (isNaN(P["r"] * P["i"])) {
            parser_exit();
        }
    };

    /**
     * @constructor
     * @returns {Complex}
     */
    function Complex(a, b) {

        if (!(this instanceof Complex)) {
            return new Complex(a, b);
        }

        parse(a, b);

        this["r"] = P["r"];
        this["i"] = P["i"];
    }

    Complex.prototype = {
        
        "r": 0,
        "i": 0,
        
        /**
         * Adds two complex numbers
         *
         * @returns {Complex}
         */
        "add": function(a, b) {

            // Doesn't overflow
            parse(a, b);

            return new Complex(
                    this["r"] + P["r"],
                    this["i"] + P["i"]
                    );
        },
        
        /**
         * Subtracts two complex numbers
         *
         * @returns {Complex}
         */
        "sub": function(a, b) {

            // Doesn't overflow
            parse(a, b);

            return new Complex(
                    this["r"] - P["r"],
                    this["i"] - P["i"]
                    );
        },
        
        /**
         * Multiplies two complex numbers
         *
         * @returns {Complex}
         */
        "mul": function(a, b) {

            // Todo: is there a way r*r doesn't overflow?
            parse(a, b);

            return new Complex(
                    this["r"] * P["r"] - this["i"] * P["i"],
                    this["r"] * P["i"] + this["i"] * P["r"]
                    );
        },
        
        /**
         * Divides two complex numbers
         *
         * @returns {Complex}
         */
        "div": function(a, b) {

            // Doesn't overflow
            parse(a, b);

            a = this['r'];
            b = this['i'];

            var c = P["r"];
            var d = P["i"];
            var t, x;

            if (0 === c && 0 === d) {
                throw "DIV/0";
            }

            if (Math.abs(c) < Math.abs(d)) {
                x = c / d;
                t = c * x + d;

                return new Complex(
                        (a * x + b) / t,
                        (b * x - a) / t);

            } else {
                x = d / c;
                t = d * x + c;

                return new Complex(
                        (a + b * x) / t,
                        (b - a * x) / t);
            }
        },
        
        /**
         * Calculate the power of two complex numbers
         *
         * @returns {Complex}
         */
        "pow": function(a, b) {

            // Doesn't overflow
            parse(a, b);

            a = this["r"];
            b = this["i"];

            if (a === 0 && b === 0) {
                return new Complex(0, 0);
            }

            var arg = Math.atan2(b, a);
            var log = logsq2(a, b);

            a = Math.exp(P["r"] * log - P["i"] * arg);
            b = P["i"] * log + P["r"] * arg;

            return new Complex(
                    a * Math.cos(b),
                    a * Math.sin(b)
                    );
        },
        
        /**
         * Calculate the complex square root
         *
         * @returns {Complex}
         */
        "sqrt": function() {

            // Doesn't overflow
            var r = this["abs"]();

            return new Complex(
                    Math.sqrt((r + this["r"]) * 0.5),
                    Math.sqrt((r - this["r"]) * 0.5) * H(this["i"])
                    );
        },
        
        /**
         * Calculate the complex exponent
         *
         * @returns {Complex}
         */
        "exp": function() {

            // Doesn't overflow
            var tmp = Math.exp(this["r"]);

            return new Complex(
                    tmp * Math.cos(this["i"]),
                    tmp * Math.sin(this["i"]));
        },
        
        /**
         * Calculate the natural log
         *
         * @returns {Complex}
         */
        "log": function() {

            var a = this["r"];
            var b = this["i"];

            // Doesn't overflow
            return new Complex(
                    logsq2(a, b),
                    Math.atan2(b, a));
        },
        
        /**
         * Calculate the magniture of the complex number
         *
         * @returns {number}
         */
        "abs": function() {

            // Doesn't overflow

            var a = Math.abs(this["r"]);
            var b = Math.abs(this["i"]);

            if (a < 1000 && b < 1000) {
                return Math.sqrt(a * a + b * b);
            }

            if (a < b) {
                a = b;
                b = this["r"] / this["i"];
            } else {
                b = this["i"] / this["r"];
            }
            return a * Math.sqrt(1 + b * b);
        },
        
        /**
         * Calculate the angle of the complex number
         *
         * @returns {number}
         */
        "arg": function() {
            
            // Doesn't overflow

            return Math.atan2(this["i"], this["r"]);
        },
        
        /**
         * Calculate the sine of the complex number
         *
         * @returns {Complex}
         */
        "sin": function() {
            
            // Doesn't overflow

            var a = this["r"];
            var b = this["i"];

            return new Complex(
                    Math.sin(a) * Math.cosh(b),
                    Math.cos(a) * Math.sinh(b)
                    );
        },
        
        /**
         * Calculate the cosine
         *
         * @returns {Complex}
         */
        "cos": function() {
            
            // Doesn't overflow

            var a = this["r"];
            var b = this["i"];

            return new Complex(
                    Math.cos(a) * Math.cosh(b),
                    -Math.sin(a) * Math.sinh(b)
                    );
        },
        
        /**
         * Calculate the tangent
         *
         * @returns {Complex}
         */
        "tan": function() {
            
            // Doesn't overflow

            var a = this["r"];
            var b = this["i"];

            var d = Math.cos(2 * a) + Math.cosh(2 * b);

            return new Complex(
                    Math.sin(2 * a) / d,
                    Math.sinh(2 * b) / d
                    );
        },
        
        /**
         * Calculate the complex arcus sinus
         *
         * @returns {Complex}
         */
        "asin": function() {

            return this["mul"](this)["neg"]()["add"](1)["sqrt"]()
                    ["add"](this["mul"](Complex["I"]))["log"]()["mul"](Complex["I"])["neg"]();
        },
        
        /**
         * Calculate the complex arcus cosinus
         *
         * @returns {Complex}
         */
        "acos": function() {

            return this["mul"](this)["neg"]()["add"](1)["sqrt"]()
                    ["mul"](Complex["I"])["add"](this)["log"]()["mul"](Complex["I"])["neg"]();
        },
        
        /**
         * Calculate the complex arcus tangent
         *
         * @returns {Complex}
         */
        "atan": function() {

            return Complex["I"]["add"](this)["div"](Complex["I"]["sub"](this))
                    ["log"]()["mul"](Complex["I"])["div"](2);
        },
        
        /**
         * Calculate the complex sinh
         *
         * @returns {Complex}
         */
        "sinh": function() {
            
            // Doesn't overflow

            var a = this["r"];
            var b = this["i"];

            return new Complex(
                    Math.sinh(a) * Math.cos(b),
                    Math.cosh(a) * Math.sin(b)
                    );
        },
        
        /**
         * Calculate the complex cosh
         *
         * @returns {Complex}
         */
        "cosh": function() {
            
            // Doesn't overflow

            var a = this["r"];
            var b = this["i"];

            return new Complex(
                    Math.cosh(a) * Math.cos(b),
                    Math.sinh(a) * Math.sin(b)
                    );
        },
        
        /**
         * Calculate the complex tanh
         *
         * @returns {Complex}
         */
        "tanh": function() {
            
            // Doesn't overflow

            var a = this["r"];
            var b = this["i"];

            var d = Math.cosh(2 * a) + Math.cos(2 * b);

            return new Complex(
                    Math.sinh(2 * a) / d,
                    Math.sin(2 * b) / d
                    );
        },
        
        /**
         * Calculate the complex inverse 1/z
         *
         * @returns {Complex}
         */
        "inverse": function() {

            var a = this["r"];
            var b = this["i"];

            var t = a * a + b * b;

            if (0 === t) {
                throw "DIV/0";
            }
            return new Complex(a / t, -b / t);
        },
        
        /**
         * Returns the complex conjugate
         *
         * @returns {Complex}
         */
        "conjugate": function() {
            
            // Doesn't overflow

            return new Complex(this["r"], -this["i"]);
        },
        
        /**
         * Gets the negated complex number
         *
         * @returns {Complex}
         */
        "neg": function() {
            
            // Doesn't overflow
            
            return new Complex(-this["r"], -this["i"]);
        },
        
        /**
         * Compares two complex numbers
         *
         * @returns {boolean}
         */
        "equals": function(a, b) {
            
            // Doesn't overflow

            parse(a, b);

            return Math.abs(P["r"] - this["r"]) <= EPSILON && Math.abs(P["i"] - this["i"]) <= EPSILON;
        },
        
        /**
         * Clones the actual object
         *
         * @returns {Complex}
         */
        "clone": function() {
            
            // Doesn't overflow

            return new Complex(this["r"], this["i"]);
        },
        
        /**
         * Gets a string of the actual complex number
         *
         * @returns {String}
         */
        "toString": function() {

            var a = this["r"];
            var b = this["i"];

            if (isNaN(a * b)) {
                return "NaN";
            }

            var ret = "";

            if (a !== 0) {
                ret += a;
            }

            if (b !== 0) {

                if (b > 0 && a !== 0)
                    ret += "+";

                if (b === -1) {
                    ret += "-";
                } else if (b !== 1) {
                    ret += b;
                }
                ret += "i";
            }

            if (ret === "")
                return "0";

            return ret;
        },
        
        /**
         * Returns the actual number as a vector
         *
         * @returns {Array}
         */
        "toVector": function() {

            return [this.r, this.i];
        },
        
        /**
         * Returns the actual real value of the current object
         *
         * @returns {number|null}
         */
        "valueOf": function() {

            if (this["i"] === 0) {
                return this["r"];
            }
            return null;
        }
    };

    Complex["ZERO"] = new Complex;
    Complex["ONE"] = new Complex(1, 0);
    Complex["I"] = new Complex(0, 1);
    Complex["PI"] = new Complex(Math.PI, 0);
    Complex["E"] = new Complex(Math.E, 0);

    if (typeof define === "function" && define["amd"]) {
        define([], function() {
            return Complex;
        });
    } else if (typeof exports === "object") {
        module["exports"] = Complex;
    } else {
        root["Complex"] = Complex;
    }

})(this);
