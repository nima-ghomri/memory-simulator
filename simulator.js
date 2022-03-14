import Memory from "./Memory.js";

const DATATYPES = {
  bool: { min: "False", max: "True" },
  int: { min: -2147483648, max: 2147483647, step: "1" },
  long: { min: -9223372036854775808, max: 9223372036854775807, step: "1" },
  float: { min: "3.4E -38", max: "3.4E +38", step: "any" },
  double: { min: "1.7E -308", max: "1.7E +308", step: "any" },
  string: {},
  char: {},
  pointer: {},
};

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

  // Value input field change
  $("#select-type").change((e) => changeDataType(e.target.value));

  // Store value
  $("#variable-form").submit((e) => {
    e.preventDefault();
    storeVariable();
    $("#variable-form")[0].reset();
  });

  //test
  // runTests();
});

function runTests(){
  test("bool", "myBoolean", "True", 2);
  test("string", "message", "This is CS50");
  test("char", "x", "X");
  test("int", "myInt", "50");
  test("double", "myDouble", "-1234.56789");
  $("#myDouble").children(".close").click();
  test("float", "myFloat", "10.75", 24);
  test("long", "num", "12345678900", 29);
  test("pointer", "ptr", "myInt", 48);
  test("string", "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH0", "x");
  test("string", "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH1", "x");
  // test("string", "longMessage", "This is a very long message", 39);
}

function test(type, name, value, index) {
  if (index !== undefined)
    $(".byte").eq(index).prop("checked", true).trigger("click");
  changeDataType(name);
  $("#select-type").val(type);
  $("#input-name").val(name);
  $("#input-value").val(value);
  storeVariable();
}

function storeVariable() {
  var type = $("#select-type").val();
  var name = $("#input-name").val();
  var value = $("#input-value").val();
  var variable = memory.store(type, name, value);
  
  // Remove variable
  variable.element.children(".close").click(removeVariable);
}

function removeVariable(e) {
  let element = e.target.parentNode;
  memory.variables.delete(element.id);
  element.remove();
}

function changeDataType(name) {
  $("#input-value").remove();
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
                        step="${type["step"]}"
                        required
                        />`;
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
    case "pointer":
      content = `<select id="input-value"
                           name="value"
                           class="form-select"
                           aria-label="True or false selection menu"
                           required>
                    <option value="" selected disabled>Value</option>
                    ${[...memory.variables.keys()].map(
                      (x) => `<option value="${x}">${x}</option>`
                    )}
                   </select>`;
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
