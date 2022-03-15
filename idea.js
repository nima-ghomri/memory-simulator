import Memory from "./Memory.js";
import Variable from "./Variable.js";

$(document).ready(() => {
    storeVariable();
  $("#variable-input").on("input", storeVariable);
});

function storeVariable() {
    $("#memory").children().remove();
    let memory = new Memory(4);
     memory.store("int", "myv", $("#variable-input").val());
}