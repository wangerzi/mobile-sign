const Hashes = require('hashes')
const SparkMD5 = require('spark-md5');
var MOBILE_SIGN = {
}
/**
 * Calc json format Sign
 * @param keyStr
 * @param secret
 * @param data Object
 * @param mergeStr
 * @returns {string}
 */
function calcJsonSign(keyStr, secret, data, mergeStr) {
    // calc md5 and return sign
    let MD5 = new Hashes.MD5();
    // console.log("merged field:", fields.join(mergeStr) + mergeStr + values.join(mergeStr) + mergeStr);
    return MD5.hex(calcJsonMergeStr(keyStr, secret, data, mergeStr));
}

function calcJsonMergeStr(keyStr, secret, data, mergeStr) {
    mergeStr = mergeStr ? mergeStr : ''
    // 1. resort keys
    const fields = Object.getOwnPropertyNames(data).sort()
    // 2. merge fields
    let values = [];
    for (let i = 0; i < fields.length; i++) {
        let key = fields[i];
        let item = data[key];
        if (item instanceof Object) {
            item = JSON.stringify(item);
        } else if (item && item.toString) {
            item = item.toString();
        }
        values.push(item);
    }
    return keyStr + mergeStr + fields.join(mergeStr) + mergeStr + values.join(mergeStr) + mergeStr + secret;
}

/**
 * Calc FormData Sign, support File
 * @param keyStr App Key
 * @param secret App Secret
 * @param formData FormData
 * @param mergeStr string between props
 * @returns {Promise<*>}
 */
async function calcFormDataSign(keyStr, secret, formData, mergeStr) {
    // calc md5 and return the sign
    let MD5 = new Hashes.MD5();
    // console.log("merged field:", fields.join(mergeStr) + mergeStr + values.join(mergeStr) + mergeStr);
    return MD5.hex(calcFormDataMergeStr(keyStr, secret, formData, mergeStr));
}
async function calcFormDataMergeStr(keyStr, secret, formData, mergeStr) {
    mergeStr = mergeStr ? mergeStr : ''
    // 1. resort key
    const fields = [];
    for (let key of formData.keys()) {
        fields.push(key);
    }

    fields.sort();
    // 2. merge all props, multi same filed only count 1 time.
    const values = [];
    const mergedField = [];
    for (let key of fields) {
        if (mergedField.indexOf(key) === -1) {
            const tmp = formData.getAll(key);
            values.push.apply(values, tmp);
            mergedField.push(key);
        }
    }
    for (let i = 0; i < values.length; i++) {
        if (values[i] instanceof File) {
            values[i] = await getFileMD5(values[i]);
        }
    }
    // console.log("sorted field:", fields);
    // console.log("sorted values:", values);
    return keyStr + mergeStr + fields.join(mergeStr) + mergeStr + values.join(mergeStr) + mergeStr + secret;
}

/**
 * Get file md5
 * @param file
 * @returns {Promise<string>}
 */
async function getFileMD5(file) {
    let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice,
        chunkSize = 2097152, // Read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

    return new Promise(function (resolve, reject) {
        fileReader.onload = function (e) {
            // console.log("read chunk nr", currentChunk + 1, "of", chunks);
            spark.append(e.target.result); // Append array buffer
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            } else {
                // console.log("finished loading");
                resolve(spark.end());
            }
        };

        fileReader.onerror = function () {
            // console.warn("oops, something went wrong.");
            reject("Get md5 Failed");
        };

        function loadNext() {
            const start = currentChunk * chunkSize,
                end = start + chunkSize >= file.size ? file.size : start + chunkSize;

            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }

        loadNext();
    });
}

MOBILE_SIGN.calcJsonSign = calcJsonSign;
MOBILE_SIGN.calcJsonMergeStr = calcJsonMergeStr;
MOBILE_SIGN.calcFormDataSign = calcFormDataSign;
MOBILE_SIGN.calcFormDataMergeStr = calcFormDataMergeStr;
MOBILE_SIGN.getFileMD5 = getFileMD5;
exports = module.exports = MOBILE_SIGN;