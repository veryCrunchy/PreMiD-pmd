const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config({ path: 'release.env' });

const version = process.env.version;

const packageName = `packages-cli-release-v${version}`;
const destinationDir = path.resolve(__dirname, '..', packageName);

const copyDirectory = (source, destination) => {
  fs.mkdirSync(destination, { recursive: true });

  fs.readdirSync(source).forEach((file) => {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
};

try {
  const sourceDir = path.resolve(__dirname);

  // Copy the contents of the current directory to the destination directory
  copyDirectory(sourceDir, destinationDir);

  // Create a .gitattributes file to prevent line ending normalization
  fs.writeFileSync(path.join(destinationDir, '.gitattributes'), '* -text\n');

  // Change into the destination directory
  process.chdir(destinationDir);

  // Initialize a new Git repository
  execSync('git init');

  // Add all files to the Git repository
  execSync('git add .');

  // Commit the changes
  execSync(`git commit -m "Release v${version}"`);

  // Create a new GitHub repository (replace with your GitHub username and repository name)
  // This assumes you have already created an empty repository on GitHub
  execSync(`git remote add origin ${process.env.origin}`);

  // Create and switch to a new branch
  execSync(`git checkout -b ${version}`);
  console.log(`Switched to branch ${version} successfully.`);

  // Push the changes to GitHub
  execSync('git push -u origin HEAD');

  // Clean up any temporary files or directories if needed
  process.chdir('..');
  fs.rmdirSync(packageName, { recursive: true });

  console.log('Release script completed successfully!');
} catch (error) {
  console.error(`Error: ${error.message}`);
}
