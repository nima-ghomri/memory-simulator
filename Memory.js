import Byte from "./Byte.js";
import Variable from "./Variable.js";

export class Memory {
  constructor(volumn) {
    this.bytes = [];
    this.allocate(volumn);
    this.variables = new Map();
    this.setIndex(0);
  }

  getIntegerBytes(x, size) {
    let bits = Math.abs(x)
      .toString(2)
      .padStart(size * 8, "0")
      .split("")
      .map((b) => b == "1");

    if (x < 0) {
      // 1's complement
      bits = bits.map((b) => !b);
      // 2's complement
      for (let i = bits.length - 1; i >= 1; i--) {
        if ((bits[i] ^= true)) break;
      }
    }

    var bytes = [];
    for (let i = 0; i < size; i++) {
      bytes[i] = bits
        .slice(i * 8, (i + 1) * 8)
        .map((x) => (x ? "1" : "0"))
        .join("");
    }
    return bytes;
  }

  /*
  f: the float number
  size: number of bytes
  e: exponent bits
  */
  getFloatBytes(f, size, e) {
    let s = size * 8 - e - 1;
    let integral = Math.floor(Math.abs(f));
    let fractional = Math.abs(f) - integral;

    let integralPart = integral.toString(2);
    let fractionalPart = "";
    for (let i = 0; i < s; i++) {
      fractional *= 2;
      integral = Math.floor(fractional);
      fractionalPart += integral;
      if (fractional == 1) break;
      fractional -= integral;
    }

    let allParts = `${integralPart}${fractionalPart}`;
    let power = integralPart.length - allParts.indexOf("1") - 1;
    let bias = Math.pow(2, e - 1) - 1;
    let exponent = (power + bias).toString(2).padStart(e, "0");
    let significant = allParts
      .substring(integralPart.length - power)
      .padEnd(s, "0");
    let binary = `${f < 0 ? 1 : 0}${exponent}${significant}`;

    let bytes = [];
    for (let i = 0; i < size; i++) {
      bytes[i] = binary.substring(i * 8, (i + 1) * 8);
    }
    return bytes;
  }

  store(type, name, value) {
    switch (type) {
      case "bool":
        var bits = [value == "True" ? "00000001" : "00000000"];
        var values = [value];
        var center = true;
        break;

      case "int":
        var bits = this.getIntegerBytes(value, 4);
        break;

      case "long":
        var bits = this.getIntegerBytes(value, 8);
        break;

      case "float":
        var bits = this.getFloatBytes(value, 4, 8);
        break;

      case "double":
        var bits = this.getFloatBytes(value, 8, 11);
        break;

      case "string":
        var bits = Array.from(value + "\0").map((c) =>
          c.charCodeAt(0).toString(2).padStart(8, "0")
        );
        var values = Array.from(value).concat("\\0");
        var center = true;
        break;

      case "char":
        var bits = [value.charCodeAt(0).toString(2).padStart(8, "0")];
        var values = [value];
        var center = true;
        break;

      case "pointer":
        let head = this.variables.get(value).head;
        var bits = this.getIntegerBytes(head.index, 8);
        var value = head.address;
        break;
      default:
        return null;
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
          return null;
        }
      }
      alert("Stack Overflow!");
      return null;
    }

    if (this.variables.has(name)) {
      alert(`The vairable '${name}' already exists.`);
      return null;
    } else {
      let variable = new Variable(
        name,
        type,
        buffer,
        bits,
        values,
        value,
        center
      );

      $("#variables").append(variable.element);
      this.variables.set(name, variable);
      this.setIndex(index + bits.length);
      return variable;
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
      $("#memory").append(byte.input);
      $("#memory").append(byte.element);
    }

    // Memory volum cannot be changed
    if (Object.freeze) Object.freeze(this.bytes);
  }
}

export default Memory;
