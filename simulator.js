// import Byte from "./Byte.js"
class Byte {
  constructor(index) {
    this.index = index;
    this.address =
      "0x" + this.index.toString(16).padStart(8, "0").toUpperCase();
    this.value = null;
    this.bits = new Uint8Array(1);
  }

  getAddress() {
    return this.address;
  }

  getBits() {
    return this.bits[0].toString(8).padStart(8, "0");
  }

  getValue() {
    return this.value.toString();
  }
}

class Memory {
  constructor(volumn) {
    this.bytes = [];
    this.allocate(volumn);
  }

  allocate(volumn) {
    console.log(volumn);
    for (let index = 0; index < volumn; index++) {
      let byte = new Byte(index);
      this.bytes.push(byte);
      $("#memory").append(
        $.parseHTML(`
        <div class="byte">
          <div class="bits">${byte.getBits()}</div>
          <div class="value"></div>
          <div class="address">${byte.getAddress()}</div>
        </div>
        `)
      );
    }

    // Memory volum cannot be changed
    if (Object.freeze) Object.freeze(this.bytes);
  }
}

var memory = null;
const DATATYPES = {
  bool: { min: "False", max: "True" },
  int: { min: -2147483648, max: 2147483647 },
  long: { min: -9223372036854775808, max: 9223372036854775807 },
  string: {},
  char: {},
};

$(document).ready(function () {
  // Create memory
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const volumn = urlParams.get("bytes") ?? 128;
  memory = new Memory(volumn);
  console.log(memory);

  // Fill data types drop down menu
  Object.keys(DATATYPES).forEach((data) => {
    $("#select-type").append(`<option value="${data}">${data}</option>`);
  });

  $("#store").on('click',()=>
  console.log("test")
  );

  // Value input field change
  $("#select-type").change((event) => {
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
  });
});
