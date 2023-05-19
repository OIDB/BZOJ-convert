const {mkdirSync, existsSync, readFileSync, writeFileSync} = require('fs');

if(!existsSync('tmp'))
    mkdirSync('tmp');

var list=readFileSync('dist/list.json','utf8');
list=JSON.parse(list);

var res=``;

list.forEach(pro=>res+=pro.title+'\n');
writeFileSync('tmp/titlefix_list',res);