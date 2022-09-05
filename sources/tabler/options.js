module.exports = {
    name: '@tabler/icons',
    url: 'https://github.com/tabler/tabler-icons',

    decompress: {
        filter: (file) => {
            return file.path === 'package/package.json' || file.path.startsWith('package/icons/');
        }
    },

    dirs: 'icons'
};
