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

  setBits(bits){
    var binary  = new Uint8Array([bits])[0].toString(2).padStart(8, "0");
    this.element.children(".bits").html(binary);
  }

  setValue(value) {
    this.element.children(".value").html(value);
  }
}

class Variable {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

const DATATYPES = {
  bool: { min: "False", max: "True" },
  int: { min: -2147483648, max: 2147483647 },
  long: { min: -9223372036854775808, max: 9223372036854775807 },
  string: {},
  char: {},
};

class Memory {
  constructor(volumn) {
    this.bytes = [];
    this.allocate(volumn);
    this.selected = this.bytes[0];
    this.variables = new Map();
  }

  store() {
    var type = $("#select-type").val();
    var name = $("#input-name").val();
    var value = $("#input-value").val();

    this.variables.set(name, new Variable(type, value));
    this.bytes[0].setValue(0);
    this.bytes[0].setBits(1);

    switch (type) {
      case "string":
        for (let i = this.selected.index; i < value.length; i++) {
          console.log(value[i]);
        }
        break;

      default:
        break;
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

  document.getElementById("store").addEventListener(
    "click",
    function () {
      memory.store();
    },
    false
  );
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
      content = `<select id="input-value" name="value" class="form-select" aria-label="True or false selection menu">
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
                        max="${type["max"]}"/> `;
      break;
    case "char":
      content = `<input id="input-value"
                        name="value" 
                        type="text" 
                        class="form-control" 
                        placeholder="Value" 
                        aria-label="Value" 
                        pattern=".{1}" 
                        oninvalid="setCustomValidity('Please enter 1 character.')" />`;
      break;
    default:
      content = `<input id="input-value" 
                        name="value" 
                        type="text" 
                        class="form-control" 
                        placeholder="Value" 
                        aria-label="Value" 
                        autocomplete="off"/>`;
      break;
  }
  $(content).insertAfter("#input-name");
}
