const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawn } = require('child_process');
const axios = require('axios');
const EC = require('eight-colors');
const decompress = require('decompress');
const Gauge = require('gauge');
let gauge;

const sh = (cmd, options = {}) => {
    return new Promise((resolve, reject) => {
        const cp = spawn(cmd, {
            shell: true,
            stdio: 'inherit',
            ... options
        });
        cp.on('error', (err) => {
            reject(err);
        });
        cp.on('close', () => {
            resolve();
        });
        cp.on('exit', () => {
            resolve();
        });
    });
};

const rmSync = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, {
            recursive: true,
            force: true,
            maxRetries: 10
        });
    }
};

const installFromNpm = async (listInstallFromNpm) => {
    const installDir = path.resolve(__dirname, '../.temp/install-from-npm');
    if (!fs.existsSync(installDir)) {
        fs.mkdirSync(installDir, {
            recursive: true
        });
    }

    const dependencies = {};
    listInstallFromNpm.forEach((pkg) => {
        const { config } = pkg;
        dependencies[config.name] = 'latest';
    });

    // generate package.json

    const packageJson = {
        'name': 'open-icons-dependencies',
        'version': '1.0.0',
        'description': '',
        'main': '',
        'dependencies': dependencies
    };

    fs.writeFileSync(path.resolve(installDir, 'package.json'), JSON.stringify(packageJson, null, 4));
    fs.writeFileSync(path.resolve(installDir, '.npmrc'), 'audit=false');

    const lockPath = path.resolve(installDir, 'package-lock.json');
    if (fs.existsSync(lockPath)) {
        fs.rmSync(lockPath, {
            force: true,
            maxRetries: 10
        });
    }

    await sh('npm install -dd', {
        cwd: installDir
    });

};


const downloadFile = async (url, filePath, retry = 0) => {

    console.log(`start download: ${url}`);

    let err;
    const res = await axios({
        method: 'get',
        url: url,
        timeout: 15 * 1000,
        responseType: 'stream',
        // onDownloadProgress: (d) => {
        //     const {
        //         loaded,
        //         total,
        //         // progress, bytes,
        //         estimated
        //         // rate, download = true
        //     } = d;
        //     console.log(loaded / total, estimated);
        // },
        httpsAgent: new https.Agent({
            // keepAlive: true,
            rejectUnauthorized: false
        })
    }).catch((e) => {
        err = e;
    });

    if (err) {
        EC.logRed(err);

        if (retry < 5) {
            EC.logYellow(`retry download: ${url}`);
            return downloadFile(url, filePath, retry + 1);
        }

        EC.logRed(`failed to download: ${url}`);
        return 1;
    }

    const { data, headers } = res;

    if (!data) {
        EC.logRed(`invalid response data: ${url}`);
        return 1;
    }

    let totalLength;
    let length = 0;

    if (!gauge) {
        gauge = new Gauge();
    }

    const writer = fs.createWriteStream(filePath);

    data.on('data', (chunk) => {
        length += chunk.length;
        if (!totalLength) {
            totalLength = headers['content-length'];
        }
        if (totalLength) {
            const per = length / totalLength;
            const text = `${(per * 100).toFixed(2)}% downloading ${url} ...`;
            // console.log(text);
            gauge.enable();
            gauge.show(text, per);
        }
    });
    data.pipe(writer);

    return new Promise((resolve) => {
        writer.on('finish', () => {
            gauge.disable();
            console.log(`downloaded: ${filePath}`);
            resolve(0);
        });
        writer.on('error', (e) => {
            EC.logRed(e);
            resolve(1);
        });
    });

};

const decompressPackage = async (filePath, pkgDir, config) => {

    console.log(`package decompressing: ${config.name} ...`);

    const options = {};

    let moduleFilters = config.moduleFilters;
    if (moduleFilters) {
        if (!Array.isArray(moduleFilters)) {
            moduleFilters = [moduleFilters];
        }
        moduleFilters.push('package.json');
        moduleFilters = moduleFilters.map((item) => {
            return `${config.moduleEntry}/${item}`;
        });

        options.filter = (file) => {
            for (const f of moduleFilters) {
                if (file.path.startsWith(f)) {
                    return true;
                }
            }
            return false;
        };
    }


    let hasError;
    const files = await decompress(filePath, pkgDir, options).catch(function(err) {
        EC.logRed(err);
        hasError = true;
    });

    if (hasError) {
        return 1;
    }

    console.log(files[0] && files[0].path);

    console.log(`package decompressed: ${config.name} (${files.length} files)`);

    return 0;
};

const downloadFromUrl = async (listDownloadFromUrl) => {
    const downloadDir = path.resolve(__dirname, '../.temp/download-from-url');
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, {
            recursive: true
        });
    }

    for (const pkg of listDownloadFromUrl) {
        const { name, config } = pkg;

        const pkgDir = path.resolve(downloadDir, name);
        if (!fs.existsSync(pkgDir)) {
            fs.mkdirSync(pkgDir, {
                recursive: true
            });
        }

        const filePath = path.resolve(pkgDir, 'package.zip');
        if (!fs.existsSync(filePath)) {
            const url = config.downloadUrl;
            const code = await downloadFile(url, filePath);
            if (code) {
                rmSync(filePath);
                process.exit(code);
            }
        }

        // decompress
        const packageDir = path.resolve(pkgDir, config.moduleEntry);
        if (!fs.existsSync(packageDir)) {
            const code = await decompressPackage(filePath, pkgDir, config);
            if (code) {
                rmSync(packageDir);
                process.exit(code);
            }
        }

    }
};

const download = async () => {
    const sourcesRoot = path.resolve(__dirname, '../sources');
    const list = fs.readdirSync(sourcesRoot);

    const listDownloadFromUrl = [];
    const listInstallFromNpm = [];
    list.forEach((name) => {
        const configPath = path.resolve(sourcesRoot, name, 'options.js');
        const config = require(configPath);
        const item = {
            name,
            config
        };
        if (config.downloadUrl) {
            listDownloadFromUrl.push(item);
        } else {
            listInstallFromNpm.push(item);
        }
    });


    await installFromNpm(listInstallFromNpm);

    await downloadFromUrl(listDownloadFromUrl);

};


download();
