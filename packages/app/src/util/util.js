export const hasOwn = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

export const BF = function(v, places = 1, base = 1024) {
    if (v === 0) {
        return '0B';
    }
    let prefix = '';
    if (v < 0) {
        v = Math.abs(v);
        prefix = '-';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    for (let i = 0, l = units.length; i < l; i++) {
        const min = Math.pow(base, i);
        const max = Math.pow(base, i + 1);
        if (v > min && v < max) {
            const unit = units[i];
            v = prefix + (v / min).toFixed(places) + unit;
            break;
        }
    }
    return v;
};


export const unbindEvents = function(events) {
    if (!events) {
        return;
    }
    Object.keys(events).forEach((type) => {
        const item = events[type];
        if (item.target) {
            item.target.removeEventListener(type, item.handler, item.options);
        }
    });
};

export const bindEvents = function(events, target) {
    if (!events) {
        return;
    }
    unbindEvents(events);
    Object.keys(events).forEach((type) => {
        const item = events[type];
        item.target = item.target || target;
        item.target.addEventListener(type, item.handler, item.options);
    });
};

export const preventDefault = function(e) {
    if (e && typeof e.preventDefault === 'function' && e.cancelable) {
        e.preventDefault();
    }
};


export const throttle = function(callback, time = 100) {
    let last = 0;
    let timeout;
    const handler = function() {
        const now = Date.now();
        if (now > last + time) {
            clearTimeout(timeout);
            last = now;
            callback.apply(this, arguments);
            return;
        }

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            last = now;
            callback.apply(this, arguments);
        }, time);

    };
    handler.cancel = () => {
        clearTimeout(timeout);
        last = 0;
    };
    return handler;
};
