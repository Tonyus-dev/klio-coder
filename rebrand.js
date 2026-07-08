const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, 'src');

const replacements = [
  { from: /Kaline/g, to: 'Klio' },
  { from: /kaline/g, to: 'klio' },
  { from: /KALINE/g, to: 'KLIO' },
  { from: /K∧LINE/g, to: 'KLIO' }
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const filesToRename = [];

walkDir(projectRoot, (filePath) => {
  // skip binary files or specific extensions if needed, but src is mostly ts/tsx/css
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.json')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    replacements.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated content: ${filePath}`);
    }
  }

  // check if filename needs renaming
  const fileName = path.basename(filePath);
  let newFileName = fileName;
  replacements.forEach(({ from, to }) => {
    newFileName = newFileName.replace(from, to);
  });

  if (newFileName !== fileName) {
    filesToRename.push({
      oldPath: filePath,
      newPath: path.join(path.dirname(filePath), newFileName)
    });
  }
});

// also rename directories if needed (e.g. src/lib/kaline-api)
const dirsToRename = [];
walkDir(projectRoot, () => {}); // Just to traverse, but let's do it manually for dirs

dirsToRename.push({
  oldPath: path.join(projectRoot, 'lib', 'kaline-api'),
  newPath: path.join(projectRoot, 'lib', 'klio-api')
});

dirsToRename.forEach(({ oldPath, newPath }) => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed dir: ${oldPath} -> ${newPath}`);
  }
});

filesToRename.forEach(({ oldPath, newPath }) => {
  // If the directory was renamed, oldPath might be invalid. We need to replace the old dir part.
  const oldDir = path.join(projectRoot, 'lib', 'kaline-api');
  const newDir = path.join(projectRoot, 'lib', 'klio-api');
  
  if (oldPath.startsWith(oldDir)) {
    oldPath = oldPath.replace(oldDir, newDir);
    newPath = newPath.replace(oldDir, newDir);
  }
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed file: ${oldPath} -> ${newPath}`);
  }
});

// Let's also do GuardianApp, GuardianLogin, etc. which are in src/
// the script already covers all files in src/
