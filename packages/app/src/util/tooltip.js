import { bindEvents } from './util.js';

const getTooltipText = function(elem) {
    if (elem === document) {
        return;
    }

    if (!elem.getAttribute) {
        return;
    }

    return elem.getAttribute('tooltip');
};

const showTooltip = function(state, elem) {
    hideTooltip(state, elem);

    const text = getTooltipText(elem);
    if (!text) {
        return;
    }

    state.tooltipText = text;
    state.tooltipTarget = elem;
    state.tooltipVisible = true;

};

const hideTooltip = function(state, elem) {
    state.tooltipVisible = false;
    state.tooltipTarget = null;
};

export const initTooltip = (state) => {

    const tooltipEvents = {
        mouseenter: {
            handler: (e) => {
                showTooltip(state, e.target);
            },
            options: true
        },
        mouseleave: {
            handler: (e) => {
                hideTooltip(state, e.target);
            },
            options: true
        }
    };

    setTimeout(() => {
        bindEvents(tooltipEvents, document);
    }, 100);

};
