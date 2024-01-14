/* Array helper function for log during chaining
 * Example: [1,2,3,4,5].filter(x).log(args).map(y).reduce(z)
 * Result: Log filtered array, then map and reduce afterward.
 **/

Object.defineProperty(
  Array.prototype, "log", {
    enumerable: false,
    value(...args) {
      console.log(this, ...args);
      return this;
    },
  }
);
