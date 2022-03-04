export class Variable {
  constructor(name, type, buffer, bits, values, value, removeCallback) {
    // allocate bits
    for (let i = 0; i < buffer.length; i++) {
      buffer[i].setBits(bits[i], type);
    }
    buffer.at(0).begin();
    buffer.at(-1).end();

    // set values
    if (values !== undefined) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i].setValue(values[i]);
      }
    } else if (value !== undefined) {
      let size = 4;
      let start = -Math.floor((buffer.length * size - value.length) / 2.0);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i].setValue(
          value.substring(start, start + size),
          i < buffer.length / 2
        );
        start += size;
      }
    }

    //add variable
    this.element = $(`
    <label class="variable ${type}">
      ${name}
      <button class="close">×</button>
    </label>
    `);

    this.element.children(".close").on("click", () => {
      this.element.remove();
      buffer.forEach((b) => {
        b.garbage();
      });
      removeCallback();
    });
  }
}

export default Variable;
