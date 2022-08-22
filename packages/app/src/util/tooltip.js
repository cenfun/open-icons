import VineUI from 'vine-ui';
import { bindEvents } from './util.js';

const { VuiTooltip } = VineUI;

const showTooltip = function(elem) {
    if (elem === document) {
        return;
    }

    if (!elem.getAttribute) {
        //console.log(elem);
        return;
    }
    const text = elem.getAttribute('tooltip');
    if (!text) {
        return;
    }
    hideTooltip(elem);
    elem.$tooltip = VuiTooltip.createComponent({
        target: elem,
        text: text
    });
};

const hideTooltip = function(elem) {
    if (!elem.$tooltip) {
        return;
    }
    elem.$tooltip.unmount();
    elem.$tooltip = null;
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
