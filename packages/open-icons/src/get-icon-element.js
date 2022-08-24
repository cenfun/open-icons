const getIconElement = function(icons) {
    class IconElement extends HTMLElement {

        static get observedAttributes() {
            return ['name', 'size', 'color', 'bg', 'radius'];
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

        getIcon(name, key) {
            if (!name) {
                return '';
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
                return '';
            }
            if (key) {
                return item[key];
            }
            return item;
        }

        render() {

            const name = this.getAttribute('name') || 'blank';
            const size = this.getAttribute('size') || '100%';

            const color = this.getAttribute('color');
            let $color = '';
            if (color) {
                $color = `color: ${color};`;
            }

            const bg = this.getAttribute('bg');
            let $bg = '';
            if (bg) {
                $bg = `background: ${bg};`;
            }

            let $overflow = '';
            const radius = this.getAttribute('radius');
            let $radius = '';
            if (radius) {
                $radius = `border-radius: ${radius};`;
                $overflow = 'overflow: hidden;';
            }

            this.svg = this.getIcon(name, 'svg');

            this.$style.textContent = `
            :host, svg {
                display: block;
            }
            div {
                width: ${size};
                height: ${size};
                ${$color}
                ${$bg}
                ${$radius}
                ${$overflow}
            }
        `;

            this.$container.innerHTML = this.svg;

        }
    }

    return IconElement;
};

export default getIconElement;
