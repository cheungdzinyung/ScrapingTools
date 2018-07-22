const fs = require("fs");
const longest_common_substr = require('longest-common-substring')
const _ = require('lodash')

let qs_result = JSON.parse(fs.readFileSync('../output/qs-result.json')).slice(0, 20) // .slice(0, 500) // .slice(0, 1000)
let qs_index = {};
qs_result.forEach((element, index_in_array) => {
    qs_index[element.title] = index_in_array
});

let whed_result = JSON.parse(fs.readFileSync('../output/whed_output2017.json'))
let whed_index = {};
whed_result.forEach((element, index_in_array) => {
    whed_index[element.school_name] = index_in_array
});

function isInDict(key, dict) {
    return dict[key] !== undefined;
}

let names_result = {}
"Massachusetts Institute of Technology (MIT)"
longest_common_substr

function findSimilarNames_lcs(inputName) {
    let keys = Object.keys(whed_index)
    let whed_name_with_length = keys.map(key => {
        // console.log({key, inputName});
        const {
            startString1,
            startString2,
            length
        } = longest_common_substr(
            Array.from(key), 
            Array.from(inputName)
        );
        return {
            length,
            name: key
        };
    })

    let whed_name_sorted_by_length = _.reverse(
        _.sortBy(
            whed_name_with_length, 
            [function(o) { return o.length; }])
    );
    return whed_name_sorted_by_length.slice(0,3).map(x=>x.name); // first 3 most likely name
}

function findSimilarNames(inputName) {
    if (isInDict(inputName, whed_index)) {
        return [inputName] // [whed_index[inputName]]
    } else {
        let name2 = inputName.split(" (")[0]
        if (isInDict(name2, whed_index)) {
            return [name2] // [whed_index[name2]]
        } else {
            return findSimilarNames_lcs(inputName)
        }
    }
}


let final_result = qs_result.map(ele => {
    console.log("rank", ele.rank);
    let names = findSimilarNames(ele.title)
    /* if (names.length == 1) {
        return 1
    }else{
        return names
    } */
    return {
        qs_name: ele.title,
        whed_names: names
    };
})

function sum(arr) {
    return arr.reduce((acc, cur) => acc + cur)
}

console.log("For each qs school name, find similar name in whed name list: ")
console.log(JSON.stringify(final_result, null, 2));
// console.log(sum(final_result));