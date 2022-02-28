export class Variable {
  constructor(name, type, buffer, bits, values, value) {
    // allocate bits
    for (let i = 0; i < buffer.length; i++) {
      buffer[i].element.addClass(`data ${type}`);
      buffer[i].setBits(bits[i]);
    }
    buffer[0].element.addClass(`begin`);
    buffer[buffer.length - 1].element.addClass(`end`);

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
    // $(".variable")
  }
}

export default Variable;
