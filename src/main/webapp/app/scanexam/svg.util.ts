/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Text, G } from '@svgdotjs/svg.js';

export const svgadapter = (node: any) => {
  if (node instanceof Text) {
    node.attr('svgjs:data', null);
    //                node.attr("font-size",node.attr("font-size")/this.scale)
    const text = node.node;
    if (text.childNodes.length > 0) {
      text.childNodes.forEach(e1 => {
        if (e1.nodeName === 'tspan') {
          const tspan = e1 as Element;
          const x = tspan.getAttribute('x');
          const y = tspan.getAttribute('y');
          /* if (x !== null && y !== null) {
             (node.parent() as G).translate(+x, +y);
           }*/
          const t1 = text.cloneNode(false) as any;
          const content = tspan.textContent;

          if (content) {
            t1.innerHTML = content;
          } else {
            t1.innerHTML = 'Text';
          }
          t1.setAttribute('x', x);
          t1.setAttribute('y', y);
          (node.parent() as G).add(t1);
        }
      });
      text.remove();
    }
  }
};
