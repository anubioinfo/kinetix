const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const dir = '/Users/admin/Documents/codes/aha';

async function commitAll() {
  console.log('Adding files...');
  
  function getFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      if (file === '.git' || file === 'node_modules' || file === 'dist') return;
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(path.relative(dir, fullPath));
      }
    });
    return arrayOfFiles;
  }

  const files = getFiles(dir);
  for (const file of files) {
    await git.add({ fs, dir, filepath: file });
  }

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'anubioinfo',
      email: 'anubioinfo@users.noreply.github.com'
    },
    message: 'Rebrand application to Kinetix and prepare repository for GitHub push'
  });

  console.log('Commit successful! SHA:', sha);
}

commitAll().catch(err => console.error('Error committing:', err));
