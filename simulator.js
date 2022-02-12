// import Byte from "./Byte.js"
class Byte {
  constructor(index) {
    this.index = index;
    this.address =
      "0x" + this.index.toString(16).padStart(8, "0").toUpperCase();

    this.element = $(
      `<div class="byte">
        <div class="bits"></div>
        <div class="value"></div>
        <div class="address">${this.address}</div>
      </div>`
    );
  }

  getBits() {
    return new Uint8Array(1)[0].toString(8).padStart(8, "0");
  }

  setBits(bits) {
    var binary = new Uint8Array([bits])[0].toString(2).padStart(8, "0");
    this.element.children(".bits").html(binary);
  }

  setValue(value) {
    this.element.children(".value").html(value);
  }
}

const DATATYPES = {
  bool: { min: "False", max: "True" },
  int: { min: -2147483648, max: 2147483647 },
  long: { min: -9223372036854775808, max: 9223372036854775807 },
  string: {},
  char: {},
};

function getInt64Bytes(x) {
  var bytes = [];
  var i = 8;
  do {
    bytes[--i] = x & 255;
    x = x >> 8;
  } while (i);
  return bytes;
}

// https://en.wikipedia.org/wiki/Two%27s_complement
// https://en.wikipedia.org/wiki/Endianness

function getIntegerBytes(x, size) {
  var bytes = [];
  do {
    bytes[--size] = (x & 255).toString(2).padStart(8, "0");
    x = x >> 8;
  } while (size);
  return bytes;
}

class Variable {
  constructor(type, buffer, bits, values, value) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i].element.addClass(`var ${type}`);
      buffer[i].setBits(bits[i]);
      if (values !== undefined) buffer[i].setValue(values[i]);
    }
    buffer[0].element.addClass(`begin`);
    buffer[buffer.length - 1].element.addClass(`end`);
  }
}

class Memory {
  constructor(volumn) {
    this.bytes = [];
    this.allocate(volumn);
    this.index = 0;
    this.variables = new Map();
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

    var buffer = this.bytes.slice(
      this.index,
      (this.index = this.index + bits.length)
    );
    if (this.variables.has(name)) {
      alert(`The vairable '${name}' already exists.`);
    } else {
      this.variables.set(name, new Variable(type, buffer, bits, values, value));
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

$(document).ready(function () {
  // Fill data types drop down menu
  Object.keys(DATATYPES).forEach((data) => {
    $("#select-type").append(`<option value="${data}">${data}</option>`);
  });

  // Create memory
  const volumn = new URLSearchParams(window.location.search).get("bytes") ?? 64;
  memory = new Memory(volumn);
  console.log(memory);

  $("#variable-form").submit((e) => {
    e.preventDefault();
    memory.store();
  });

  // Value input field change
  $("#select-type").change(changeDataType);
});

function changeDataType(event) {
  $("#input-value").remove();
  let name = event.target.value;
  let type = DATATYPES[name];
  let content = "";
  switch (name) {
    case "bool":
      content = `<select id="input-value"
                         name="value"
                         class="form-select"
                         aria-label="True or false selection menu"
                         required>
                  <option value="" selected disabled>Value</option>
                  <option value="${type["min"]}">${type["min"]}</option>
                  <option value="${type["max"]}">${type["max"]}</option>
                 </select>`;
      break;
    case "int":
    case "long":
      content = `<input id="input-value"
                        name="value" 
                        type="number"
                        class="form-control"
                        placeholder="Value"
                        aria-label="Value"
                        min="${type["min"]}"
                        max="${type["max"]}"/>
                        required`;
      break;
    case "char":
      content = `<input id="input-value"
                        name="value" 
                        type="text" 
                        class="form-control" 
                        placeholder="Value" 
                        aria-label="Value" 
                        pattern=".{1}" 
                        oninvalid="setCustomValidity('Please enter 1 character.')" 
                        required/>`;
      break;
    default:
      content = `<input id="input-value" 
                        name="value" 
                        type="text" 
                        class="form-control" 
                        placeholder="Value" 
                        aria-label="Value" 
                        autocomplete="off"
                        required/>`;
      break;
  }
  $(content).insertAfter("#input-name");
}
