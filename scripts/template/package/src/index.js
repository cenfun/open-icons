import metadata from './dist/wci-{name}.js';
const icons = metadata.icons;

const getIcon = function(name, key) {
    if (!name) {
        return;
    }
    let item;
    for (let i = 0, l = icons.length; i < l; i++) {
        const it = icons[i];
        if (name === it.name || name === `${it.namespace}-${it.name}`) {
            item = it;
            break;
        }
    }
    if (!item) {
        return;
    }
    if (key) {
        return item[key];
    }
    return item;
};
class IconElement extends HTMLElement {

    static get observedAttributes() {
        return ['name', 'size', 'color', 'radius', 'background'];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'open'
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
        this.render();
    }

    getIcon(id, key) {
        return getIcon(id, key);
    }

    render() {

        const name = this.getAttribute('name') || 'blank';
        const size = this.getAttribute('size') || '100%';

        const color = this.getAttribute('color');
        let $color = '';
        if (color) {
            $color = `color: ${color};`;
        }

        const background = this.getAttribute('background');
        let $background = '';
        if (background) {
            $background = `background: ${background};`;
        }

        let $overflow = '';
        const radius = this.getAttribute('radius');
        let $radius = '';
        if (radius) {
            $radius = `border-radius: ${radius};`;
            $overflow = 'overflow: hidden;';
        }

        this.svg = getIcon(name, 'svg');

        this.$style.textContent = `
            :host, svg {
                display: block;
            }
            div {
                width: ${size};
                height: ${size};
                ${$color}
                ${$background}
                ${$radius}
                ${$overflow}
            }
        `;

        this.$container.innerHTML = this.svg;

    }
}

const tagName = 'wci-{name}';
//override tagName
IconElement.tagName = tagName;

//define custom element
if (customElements.get(tagName)) {
    console.error(`${tagName} already defined`);
} else {
    customElements.define(tagName, IconElement);
}

export {
    tagName,
    icons,
    getIcon,
    IconElement
};

export default {
    tagName,
    icons,
    getIcon,
    IconElement
};
