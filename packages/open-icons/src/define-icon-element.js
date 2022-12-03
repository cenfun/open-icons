const defineIconElement = function(tagName, icons) {

    const idMap = new Map();
    icons.forEach((icon) => {
        idMap.set(icon.id, icon);
    });

    class IconElement extends HTMLElement {

        static get observedAttributes() {
            return ['name', 'size', 'color', 'bg', 'radius'];
        }

        constructor() {
            super();
            const shadow = this.attachShadow({
                // shadowRoot = null, no need shadowRoot
                mode: 'closed',
                delegatesFocus: true
            });
            this.$style = document.createElement('style');
            shadow.appendChild(this.$style);

            this.$container = document.createElement('div');
            shadow.appendChild(this.$container);
        }

        connectedCallback() {
            this.render();
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'name') {
                this.renderSvg();
            } else {
                this.renderStyle();
            }
        }

        render() {
            this.renderStyle();
            this.renderSvg();
        }

        renderStyle() {
            const ls = [':host, svg { display: block; }'];
            ls.push('div {');

            const size = this.getAttribute('size') || '100%';
            ls.push(`width: ${size}; height: ${size};`);

            const color = this.getAttribute('color');
            if (color) {
                ls.push(`color: ${color};`);
            }

            const bg = this.getAttribute('bg');
            if (bg) {
                ls.push(`background: ${bg};`);
            }
            const radius = this.getAttribute('radius');
            if (radius) {
                ls.push(`border-radius: ${radius}; overflow: hidden;`);
            }

            ls.push('}');

            this.$style.textContent = ls.join(' ');
        }

        renderSvg() {
            const name = this.getAttribute('name');
            const icon = idMap.get(name);
            const svg = icon ? icon.svg : '';
            this.$container.innerHTML = svg;
        }
    }

    // override tagName
    IconElement.tagName = tagName;
    // define custom element
    if (customElements.get(tagName)) {
        console.error(`${tagName} already defined`);
    } else {
        // console.log(tagName);
        customElements.define(tagName, IconElement);
    }

};

export default defineIconElement;
