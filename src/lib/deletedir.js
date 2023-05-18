const {existsSync, unlinkSync, rmdirSync, statSync} = require('fs');

var deleteDir=(url)=>{
    if(existsSync(url)){
        var files=[];
        files=readdirSync(url);
        files.forEach((file,index)=>{
            var curPath=path.join(url,file);
            if(statSync(curPath).isDirectory())
                deleteDir(curPath);
            else unlinkSync(curPath);
        });
        fs.rmdirSync(url);
    }
};
module.exports=deleteDir;