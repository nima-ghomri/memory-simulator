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
      console.log(
        `${
          fractional - integral
        } * 2 => ${fractional} // take ${integral} and move ${
          fractional - integral
        } to next step`
      );
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

    console.log(`${power} ${bias} ${integralPart}.${fractionalPart}`);
    console.log(`${f < 0 ? 1 : 0} ${exponent} ${significant}`);
    console.log(`${f}: ${binary}`);
    console.log("************************");
    let bytes = [];
    for (let i = 0; i < size; i++) {
      bytes[i] = binary.substring(i * 8, (i + 1) * 8);
    }
    return bytes;
  }

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

      case "float":
        var bits = this.getFloatBytes(value, 4, 8);
        break;

      case "double":
        var bits = this.getFloatBytes(value, 8, 11);
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
