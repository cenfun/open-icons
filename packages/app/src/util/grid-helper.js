
import { saveAs } from 'file-saver';
import { h, createApp } from 'vue';

const getColor = function(settings, colorIndex) {

    const color = settings.color;

    if (color === 'rainbow') {
        const colors = [
            'orangered',
            'orange',
            'green',
            'deepskyblue',
            'royalblue',
            'darkorchid'
        ];
        const index = colorIndex % colors.length;
        return colors[index];
    }

    if (color === 'custom') {
        return settings.colorCustom;
    }

    return color;
};

const getBG = (settings) => {
    const bg = settings.bg;
    if (bg === 'custom') {
        return settings.bgCustom;
    }
    return bg;
};

export const getIcon = function(settings, r) {
    const color = getColor(settings, r.tg_index);
    const bg = getBG(settings);
    const tag = r.tagName;
    return `<${tag} name="${r.name}" size="${settings.size}" color="${color}" bg="${bg}" radius="${settings.radius}"></${tag}>`;
};


export const formatter = {
    null: function(value) {
        if (value === null || typeof value === 'undefined') {
            return '';
        }
        return value;
    },
    download: function(v) {
        return `
            <div class="oi-action-downloads vui-flex-row">
                <div class="oi-icon-download" name="svg" title="download svg file">SVG</div>
                <div class="oi-icon-download" name="png" title="download png file">PNG</div>
            <div>
        `;
    },
    textarea: function(v, r, c) {
        if (c.id === 'svg') {
            return `<textarea spellcheck="false">${v}</textarea>`;
        }
        if (c.id === 'dataUrl') {
            const content = r.svg;
            const dataUrl = `data:image/svg+xml;charset=utf8,${encodeURIComponent(content)}`;
            return `<textarea spellcheck="false">${dataUrl}</textarea>`;
        }
        return `<textarea spellcheck="false">${this.getFormatter('icon')(v, r)}</textarea>`;
    }
};


export const copyContent = function(content) {
    navigator.clipboard.writeText(content);
};

export const savePNG = function(content, name, settings) {

    let color = settings.color;
    if (color === 'custom') {
        color = settings.colorCustom;
    }

    content = content.replace(/currentColor/g, color);

    const dataUrl = `data:image/svg+xml;charset=utf8,${encodeURIComponent(content)}`;

    const size = parseInt(settings.size);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.style.cssText = 'position:absolute;top:0;right:0;';
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    const img = document.createElement('img');
    img.width = size;
    img.height = size;
    img.src = dataUrl;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        document.body.removeChild(img);
        canvas.toBlob(function(blob) {
            saveAs(blob, `${name}.png`);
            document.body.removeChild(canvas);
        });
    };
    document.body.appendChild(img);

};

export const saveSVG = function(content, name) {
    const blob = new Blob([content], {
        type: 'text/plain;charset=utf-8'
    });
    saveAs(blob, `${name}.svg`);
};

export const getVueEl = function(Component, props, slots) {
    const vn = h(Component, props, slots);
    createApp({
        setup() {
            return () => {
                return vn;
            };
        }
    }).mount(document.createElement('div'));
    return vn.el;
};
