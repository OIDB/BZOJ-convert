const {spawnSync} = require('child_process');
const ghpage = require('gh-pages');

spawnSync('rm',['-rf','node_modules/gh-pages/.cache']);
spawnSync('rm',['-rf','node_modules/.cache/gh-pages']);

ghpage.publish('dist',{
    branch: 'master',
    message: 'Updates',
    repo: 'git@github.com:OIDB/BZOJ-statements.git'
},err=>{
    if(err)console.log(err.message);
    else console.log('success');
});