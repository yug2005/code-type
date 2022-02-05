const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'jimhalpert',
    database: 'languages'
})

const variable_types = ['void', 'int', 'bool', 'std::string', 'char', 'int []', 'std::vector<int>', 'std::vector<std::string>']

