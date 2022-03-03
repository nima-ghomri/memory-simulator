export class Byte {
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

  begin(){
    this.element.addClass("begin");
  }
  
  end(){
    this.element.addClass("end");
  }

  getBits() {
    return new Uint8Array(1)[0].toString(8).padStart(8, "0");
  }

  setBits(bits, type) {
    var binary = new Uint8Array([bits])[0].toString(2).padStart(8, "0");
    this.element.children(".bits").html(binary);
    this.element.addClass(`data ${type}`);
  }

  setValue(value, right) {
    let div = this.element.children(".value");
    div.html(value);
    if (right !== undefined)
      div.css("margin", right ? "0 0 0 auto" : "0 auto 0 0");
  }

  garbage(){
    this.element.attr("class", "byte garbage");
  }
}

export default Byte;
