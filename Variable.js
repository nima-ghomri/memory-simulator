export class Variable {
  constructor(name, type, buffer, bits, values, value, center) {
    // Allocate bits
    this.head = buffer[0];
    this.name = name;

    // Bits
    for (let i = 0; i < buffer.length; i++) {
      buffer[i].setBits(bits[i], type);
    }
    buffer.at(0).begin();
    buffer.at(-1).end();

    // Name
    buffer.forEach((b) => {
      b.element.addClass(name);
      b.element.mouseenter((e) => {
        $(".variable").css("opacity", 0.5);
        $(this.element).css("opacity", 1);
      });
      b.element.mouseleave((e) => {
        $(".variable").css("opacity", 1);
      });
    });

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
          center ? undefined : i < buffer.length / 2
        );
        start += size;
      }
    }

    //add variable
    this.element = $(`
    <label class="variable ${type}" name="${name}" id="${name}">
      ${name}
      <button class="close">×</button>
    </label>
    `);

    this.element.mouseenter((e) => {
      $(".byte").css("filter", "brightness(30%)");
      $(`.byte.${name}`).css("filter", "brightness(100%)");
    });

    this.element.mouseleave((e) => {
      $(".byte").css("filter", "");
    });

    this.element.children(".close").on("click", () => {
      $(".byte").css("filter", "");
      buffer.forEach((b) => {
        b.garbage();
      });
    });
  }
}

export default Variable;
