import Memory from "./Memory.js";

$(document).ready(function () {
  // Fill data types drop down menu
  Object.keys(DATATYPES).forEach((data) => {
    $("#select-type").append(
      `<option class="datatype ${data}" value="${data}">${data}</option>`
    );
  });

  // Create memory
  const volumn = new URLSearchParams(window.location.search).get("bytes") ?? 64;
  let memory = new Memory(volumn);
  window.memory = memory;

  $("#variable-form").submit((e) => {
    e.preventDefault();

    var type = $("#select-type").val();
    var name = $("#input-name").val();
    var value = $("#input-value").val();
    memory.store(type, name, value);
  });

  // Value input field change
  $("#select-type").change(changeDataType);

  //test
  memory.store("float", "var0", "2.625");
  memory.store("float", "var1", "-4.75");
  memory.store("float", "var2", "1.7");
  memory.store("float", "var3", "-1313.3125");
  memory.store("float", "var4", "0.1015625");
  memory.store("float", "var5", "39887.5625");
});

const DATATYPES = {
  bool: { min: "False", max: "True" },
  int: { min: -2147483648, max: 2147483647, step: "1" },
  long: { min: -9223372036854775808, max: 9223372036854775807, step: "1" },
  float: { min: "3.4E -38", max: "3.4E +38", step: "any" },
  double: { min: "1.7E -308", max: "1.7E +308", step: "any" },
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
    case "float":
    case "double":
      content = `<input id="input-value"
                        name="value" 
                        type="number"
                        class="form-control"
                        placeholder="Value"
                        aria-label="Value"
                        min="${type["min"]}"
                        max="${type["max"]}"
                        step="${type["step"]}"/>
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
