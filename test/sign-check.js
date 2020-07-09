const sign = require('../index');
const mocha = require('mocha')
const assert = require('assert');
const FormData = require('form-data');

const testJson = {
    name: "测试",
    age: 12,
    children: [
        {
            name: '测试2',
            age: 13,
        }
    ],
    other: {
        math: 100,
        chinese: 90,
        english: 100,
    }
}

const testFormData = new FormData();
testFormData.append('user_id', '123123');
testFormData.append('size_x', '1');
testFormData.append('size_y', '2');
testFormData.append('interest[]', '1');
testFormData.append('interest[]', '2');
testFormData.append('interest[]', '3');

mocha.describe('Json-Sign', () => {
    mocha.it('# empty merge string', () => {
        assert.strictEqual(sign.calcJsonMergeStr('123', '321', testJson, ''), '123agechildrennameother12[{"name":"测试2","age":13}]测试{"math":100,"chinese":90,"english":100}321')
    });
    mocha.it('# not empty merge string', () => {
        assert.strictEqual(sign.calcJsonMergeStr('123', '321', testJson, '&'), '123&age&children&name&other&12&[{"name":"测试2","age":13}]&测试&{"math":100,"chinese":90,"english":100}&321')
    });
})
// mocha.describe('Form-Sign', () => {
//     mocha.it('# empty merge string', () => {
//         assert.strictEqual(sign.calcFormDataMergeStr('123', '321', testFormData, ''), '')
//     });
//     mocha.it('# not empty merge string', () => {
//         assert.strictEqual(sign.calcFormDataMergeStr('123', '321', testFormData, ''), '&')
//     });
// })
