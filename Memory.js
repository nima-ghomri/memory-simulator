import Byte from "./Byte.js";
import Variable from "./Variable.js";

export class Memory {
  constructor(volumn) {
    this.bytes = [];
    this.allocate(volumn);
    this.index = 0;
    this.variables = new Map();
  }

  getIntegerBytes(x, size) {
    var bytes = [];
    do {
      bytes[--size] = (x & 255).toString(2).padStart(8, "0");
      x = x >> 8;
    } while (size);
    return bytes;
  }

  store() {
    var type = $("#select-type").val();
    var name = $("#input-name").val();
    var value = $("#input-value").val();

    switch (type) {
      case "bool":
        var bits = [value == "True" ? 1 : 0];
        var values = [value];
        break;

      case "int":
        var bits = getIntegerBytes(value, 4);
        break;
      case "long":
        var bits = getIntegerBytes(value, 8);
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

    var buffer = this.bytes.slice(this.index, this.index + bits.length);

    if (this.variables.has(name)) {
      alert(`The vairable '${name}' already exists.`);
    } else {
      this.variables.set(name, new Variable(type, buffer, bits, values, value));
      this.index = this.index + bits.length;
    }
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
