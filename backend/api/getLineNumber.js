const fetch = require('node-fetch')

const setLines = async (language) => {
    const len_res = await fetch(
        `http://localhost:3001/${language}`
    );
    const len_data = await len_res.json();
    const length = len_data[0].count;

    const code_res = await fetch(
        `http://localhost:3001/${language}/all`
    );
    const code_data = await code_res.json();

    for (var index = 0; index < code_block.length; index++) {
        var lineNumber = code_block[index].split('\n').length - 1
        const new_res = await fetch(
            `http://localhost:3001/${language}/${index}/${lineNumber}`
        )
    }
}

setLines('cpp')