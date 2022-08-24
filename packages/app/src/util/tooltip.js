import VineUI from 'vine-ui';
import { bindEvents } from './util.js';

const { VuiTooltip } = VineUI;

let tooltipInstance;

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
    tooltipInstance = VuiTooltip.createComponent({
        target: elem,
        text: text
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
