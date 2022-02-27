import Memory from "./Memory.js";

var memory;

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


const DATATYPES = {
  bool: { min: "False", max: "True" },
  int: { min: -2147483648, max: 2147483647 },
  long: { min: -9223372036854775808, max: 9223372036854775807 },
  string: {},
  char: {},
};


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
