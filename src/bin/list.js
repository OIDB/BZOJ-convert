const https = require('https');
const {writeFileSync} = require('fs');

var problems=new Array(),page=1,listmd="";

let getlist=(pageId)=>{
    if(pageId>page)return;
    process.stdout.write(`Getting page #${pageId} / ${page} (${((pageId-1)/page*100).toFixed(2)}%)\r`);
    https.get({
        host: 'hydro.ac',
        path: `/d/bzoj/p?page=${pageId}`,
        headers: {
            accept: 'application/json',
        },
    },res=>{
        let data='';
        res.on('data',chunk=>data+=chunk);
        res.on('end',()=>{
            var pdocs=JSON.parse(data);
            page=pdocs.ppcount;
            pdocs=pdocs.pdocs;
            pdocs.forEach(pdoc=>{
                problems.push({
                    id: pdoc.docId,
                    title: pdoc.title,
                    tag: pdoc.tag
                });
                listmd+=`[**#${pdoc.docId}.** ${pdoc.title}](https://hydro.ac/d/bzoj/p/${pdoc.docId})\n\n`;
            });
            writeFileSync('dist/list.json',JSON.stringify(problems,null,"  "));
            writeFileSync('dist/list.md',listmd);
            setTimeout(()=>{getlist(pageId+1);},500);
        });
    }).on("error",console.error);
};

getlist(1);