export class Byte {
  constructor(index) {
    this.free = true;
    this.index = index;
    this.address =
      "0x" + this.index.toString(16).padStart(8, "0").toUpperCase();

    this.input = $(
      `<input type="radio" name="cell" id="byte${index}" value="${index}"/>`
    );
    this.element = $(`
    
    <label class="byte" for="byte${index}">
        <div class="bits"></div>
        <div class="value"></div>
        <div class="address">${this.address}</div>
    </label>
    `);
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

  setValue(value, alignment) {
    // set value
    this.free = false;
    this.element.removeClass("garbage");
    let div = this.element.children(".value");
    div.html(value);

    // change alignment
    div.removeClass("right left");
    if (alignment !== undefined) div.addClass(alignment ? "right" : "left");
  }

  garbage() {
    this.free = true;
    this.element.attr("class", "byte garbage");
    this.element.children(".value").text("");
  }
}

export default Byte;
