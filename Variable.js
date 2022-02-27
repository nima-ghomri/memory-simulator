export class Variable {
  constructor(type, buffer, bits, values, value) {
    // allocate bits
    for (let i = 0; i < buffer.length; i++) {
      buffer[i].element.addClass(`data ${type}`);
      buffer[i].setBits(bits[i]);
      if (values !== undefined)
        buffer[i].setValue(values[i]);
    }
    buffer[0].element.addClass(`begin`);
    buffer[buffer.length - 1].element.addClass(`end`);

    //add variable
    
  }
}

export default Variable;