/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Text, G } from '@svgdotjs/svg.js';

export const svgadapter = (node: any) => {
  if (node instanceof Text) {
    node.attr('svgjs:data', null);
    //                node.attr("font-size",node.attr("font-size")/this.scale)
    const text = node.node;
    if (text.childNodes.length > 0) {
      const content = text.childNodes[0].textContent;
      let x = text.children[0].getAttribute('x');
      let y = text.children[0].getAttribute('y');
      if (x === null) {
        x = '0';
      }
      if (y === null) {
        y = '0';
      }

      (node.parent() as G).translate(+x, +y);
      text.removeChild(text.childNodes[0]);
      if (content) {
        text.innerHTML = content; // text.childNodes[0].textContent
      } else {
        text.innerHTML = 'Text';
      }
    }
  }
};
