import VineUI from 'vine-ui';
import { bindEvents } from './util.js';

const { VuiTooltip } = VineUI;

let tooltipInstance;

const getTooltipText = function(elem) {
    if (elem === document) {
        return;
    }

    if (!elem.getAttribute) {
        return;
    }

    return elem.getAttribute('tooltip');
};

const showTooltip = function(elem) {

    const text = getTooltipText(elem);
    if (!text) {
        return;
    }

    hideTooltip(elem);

    if (text === 'icon') {
        const $copy = elem.cloneNode(true);

        if ($copy.tagName.toLowerCase() === 'open-icon') {
            $copy.setAttribute('size', '300px');
        } else {
            $copy.style.setProperty('--size', '300px');
        }

        tooltipInstance = VuiTooltip.createComponent({
            props: {
                target: elem,
                html: $copy.outerHTML
            }
        });
        return;
    }

    tooltipInstance = VuiTooltip.createComponent({
        props: {
            target: elem,
            text: text
        }
    });
};

const hideTooltip = function(elem) {
    if (!tooltipInstance) {
        return;
    }
    tooltipInstance.unmount();
    tooltipInstance = null;
};

export const initTooltip = () => {

    const tooltipEvents = {
        mouseenter: {
            handler: (e) => {
                showTooltip(e.target);
            },
            options: true
        },
        mouseleave: {
            handler: (e) => {
                hideTooltip(e.target);
            },
            options: true
        }
    };

    setTimeout(() => {
        bindEvents(tooltipEvents, document);
    }, 100);

};
