import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const dir = '/Users/admin/Documents/codes/aha';

async function initAndCommit() {
  try {
    await git.init({ fs, dir });
    console.log('Git repo initialized!');

    // Add files recursively
    const ignoreFiles = ['node_modules', '.git', 'dist'];
    
    async function addFiles(currentDir) {
      const files = fs.readdirSync(currentDir);
      for (const file of files) {
        if (ignoreFiles.includes(file)) continue;
        const fullPath = path.join(currentDir, file);
        const relPath = path.relative(dir, fullPath);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          await addFiles(fullPath);
        } else {
          await git.add({ fs, dir, filepath: relPath });
        }
      }
    }

    await addFiles(dir);
    console.log('All files staged!');

    const sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'anubioinfo',
        email: 'anubioinfo@github.com',
      },
      message: 'Initial commit: Strategic Product Roadmap & Milestone Engine'
    });

    console.log('Committed successfully with SHA:', sha);
  } catch (err) {
    console.error('Git error:', err);
  }
}

initAndCommit();
