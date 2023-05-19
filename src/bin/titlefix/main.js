const {readFileSync, writeFileSync} = require('fs');
const yamljs = require('yamljs');

var list=readFileSync('dist/list.json','utf8');
list=JSON.parse(list);
var newlist=readFileSync('tmp/titlefix_list','utf8');
newlist=newlist.split('\n');

var listmd=``;

list.forEach((pro,index)=>{
    pro.title=newlist[index];
    var config=yamljs.load(`dist/problems/${pro.id}/problem.yaml`);
    config.title=newlist[index];
    writeFileSync(
        `dist/problems/${pro.id}/problem.yaml`,
        yamljs.stringify(config)
    );
    listmd+=`[**#${pro.id}.** ${pro.title}](https://hydro.ac/d/bzoj/p/${pro.id})\n\n`;
});
writeFileSync('dist/list.json',JSON.stringify(list,null,"  "));
writeFileSync('dist/list.md',listmd);