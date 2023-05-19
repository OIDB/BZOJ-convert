const {spawnSync} = require('child_process');
const ghpage = require('gh-pages');
const {existsSync, mkdirSync, readFileSync, writeFileSync} = require('fs')

if(!existsSync('tmp'))
    mkdirSync('tmp');
writeFileSync('tmp/commit_message','');
spawnSync('gedit',['tmp/commit_message']);

spawnSync('rm',['-rf','node_modules/gh-pages/.cache']);
spawnSync('rm',['-rf','node_modules/.cache/gh-pages']);

console.log(`cache cleared`)

ghpage.publish('dist',{
    branch: 'master',
    message: readFileSync('tmp/commit_message','utf8'),
    repo: 'git@github.com:OIDB/BZOJ-statements.git'
},err=>{
    if(err)console.log(err.message);
    else console.log('success');
});