const https = require('https');
const {readFileSync, writeFileSync, existsSync,
    unlinkSync, mkdirSync, createWriteStream} = require('fs');
const yamljs = require('yamljs');

var download=(host,path,referer,localpath)=>{
    if(existsSync(localpath))unlinkSync(localpath);
    https.get({
        host, path,
        headers: {
            "Referer": referer,
        },
    },res=>{
        let data='';
        res.on('data',chunk=>data+=chunk);
        res.on('end',()=>{
            directurl=data.split('Redirecting to <a href="')[1]
                .split('">/fs/hydro/problem')[0].split('&amp;').join('&');
            https.get(`https://hydro.ac${directurl}`,res=>{
                const writeStream=createWriteStream(localpath);
                res.pipe(writeStream);
                writeStream.on("finish",()=>{
                    writeStream.close();
                });
            });
        });
    }).on("error",console.error);
};

if(!existsSync('dist/problems'))
    mkdirSync('dist/problems');

var list = JSON.parse(readFileSync('dist/list.json','utf8'));

let getstatement=(id)=>{
    if(id>=list.length)return;
    var pid=list[id].id;
    https.get({
        host: 'hydro.ac',
        path: `/d/bzoj/p/${pid}`,
        headers: {
            accept: 'application/json',
        },
    },res=>{
        let data='';
        res.on('data',chunk=>data+=chunk);
        res.on('end',()=>{
            var pdoc=JSON.parse(data).pdoc;
            if(!existsSync(`dist/problems/${pdoc.docId}`))
                mkdirSync(`dist/problems/${pdoc.docId}`);
            if(!existsSync(`dist/problems/${pdoc.docId}/testdata`))
                mkdirSync(`dist/problems/${pdoc.docId}/testdata`);
                
            var content=JSON.parse(pdoc.content);
            console.log(pdoc);
            var mainconfig={
                pid: pdoc.docId,
                owner: 1,
                title: list[id].title,
                tag: list[id].tag,
                nSubmit: 0,
                nAccept: 0
            };
            writeFileSync(
                `dist/problems/${pdoc.docId}/testdata/config.yaml`,
                yamljs.stringify({type: 'default', time: `${pdoc.config.timeMin}ms`,
                    memory: `${pdoc.config.memoryMin}m`})
            );
            writeFileSync(
                `dist/problems/${pdoc.docId}/problem.yaml`,
                yamljs.stringify(mainconfig)
            );
            for(var lang in content){
                writeFileSync(
                    `dist/problems/${pdoc.docId}/problem_${lang}.md`,
                    content[lang]
                );
            }

            if(pdoc.additional_file.length>0){
                if(!existsSync(`dist/problems/${pdoc.docId}/additional_file`))
                    mkdirSync(`dist/problems/${pdoc.docId}/additional_file`);
                pdoc.additional_file.forEach((file,fileIndex)=>{
                    setTimeout(()=>{
                        download(
                            'hydro.ac',
                            `/d/bzoj/p/${pdoc.docId}/file/${file.name}?type=additional_file`,
                            `/d/bzoj/p/${pdoc.docId}`,
                            `dist/problems/${pdoc.docId}/additional_file/${file.name}`
                        );
                    },500*fileIndex+500);
                });
            }
            setTimeout(()=>getstatement(id+1),pdoc.additional_file.length*500+500);
        });
    }).on("error",console.error);
}

getstatement(0);