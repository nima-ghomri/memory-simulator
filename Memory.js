import Byte from "./Byte.js";
import Variable from "./Variable.js";

export class Memory {
  constructor(volumn) {
    this.bytes = [];
    this.allocate(volumn);
    this.variables = new Map();
    this.setIndex(0);
  }

  // getIntegerBytes(x, size) {
  //   var bytes = [];
  //   do {
  //     bytes[--size] = (x & 255).toString(2).padStart(8, "0");
  //     x = x >> 8;
  //   } while (size);
  //   return bytes;
  // }

  getIntegerBytes(x, size) {
    let binary = Math.abs(x)
      .toString(2)
      .padStart(size * 8, "0");
    if (x < 0) {
      // 1's complement
      let bits = binary.split("").map((b) => (b == "0" ? "1" : "0"));
      // 2's complement
      for (let i = bits.length - 1; i >= 1; i--) {
        if (bits[i] == "1") {
          bits[i] = "0";
        } else {
          bits[i] = "1";
          break;
        }
      }
      binary = bits.join("");
    }
    console.log(binary);

    var bytes = [];
    for (let i = 0; i < size; i++) {
      bytes[i] = binary.substring(i * 8, (i + 1) * 8);
    }
    return bytes;
  }

  getFloatBytes(x, size) {}

  store(type, name, value) {
    switch (type) {
      case "bool":
        var bits = [value == "True" ? 1 : 0];
        var values = [value];
        break;

      case "int":
        var bits = this.getIntegerBytes(value, 4);
        break;

      case "long":
        var bits = this.getIntegerBytes(value, 8);
        break;

      case "string":
        var bits = Array.from(value + "\0").map((c) => c.charCodeAt(0));
        var values = Array.from(value).concat("\\0");
        break;

      case "char":
        var bits = [value.charCodeAt(0)];
        var values = [value];
        break;
      default:
        return;
    }

    // Check empty cells
    var index = this.getIndex();
    var buffer = this.bytes.slice(index, index + bits.length);
    if (buffer.length < bits.length || buffer.some((b) => !b.free)) {
      let counter = 0;
      for (let i = 0; i < this.bytes.length; i++) {
        if (this.bytes[i].free) counter++;
        else counter = 0;
        if (counter == bits.length) {
          index = i - bits.length + 1;
          this.setIndex(index);
          alert(`Can't store "${name}" in this position. Not enough room!`);
          return;
        }
      }
      alert("Stack Overflow!");
      return;
    }

    if (this.variables.has(name)) {
      alert(`The vairable '${name}' already exists.`);
    } else {
      let variable = new Variable(name, type, buffer, bits, values, value, () =>
        this.variables.delete(name)
      );

      $("#variables").append(variable.element);
      this.variables.set(name, variable);
      this.setIndex(index + bits.length);
    }
  }

  getIndex() {
    return parseInt($('#memory input[type="radio"]:checked').val());
  }

  setIndex(value) {
    $(`#byte${value}`).prop("checked", true);
  }

  allocate(volumn) {
    for (let index = 0; index < volumn; index++) {
      let byte = new Byte(index);
      this.bytes.push(byte);
      $("#memory").append(byte.element);
    }

    // Memory volum cannot be changed
    if (Object.freeze) Object.freeze(this.bytes);
  }
}

export default Memory;
