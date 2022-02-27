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

export default Byte;