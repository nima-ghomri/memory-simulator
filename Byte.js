export class Byte {
  constructor(index) {
    this.index = index;
    this.address =
      "0x" + this.index.toString(16).padStart(8, "0").toUpperCase();

    this.element = $(`
    <input type="radio" name="cell" id="byte${index}" value="${index}"/>
    <label class="byte" for="byte${index}">
        <div class="bits"></div>
        <div class="value"></div>
        <div class="address">${this.address}</div>
    </label>
    `);
    this.free = true;
  }

  begin() {
    this.element.addClass("begin");
  }

  end() {
    this.element.addClass("end");
  }

  setBits(bits, type) {
    this.element.children(".bits").html(bits);
    this.element.addClass(`data ${type}`);
  }

  setValue(value, right) {
    this.free = false;
    this.element.removeClass("garbage");
    let div = this.element.children(".value");
    div.html(value);
    if (right !== undefined)
      div.css("margin", right ? "0 0 0 auto" : "0 auto 0 0");
  }

  garbage() {
    this.free = true;
    this.element.attr("class", "byte garbage");
    this.element.children(".value").text("");
  }
}

export default Byte;
