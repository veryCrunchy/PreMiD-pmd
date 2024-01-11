const fs = require("fs");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "release.env") });
const archiver = require("archiver");
const { Octokit } = require("octokit");
const octokit = new Octokit({
  auth: process.env.TOKEN,
});
const version = process.env.version;

const release_dir = path.resolve(__dirname, "release");
const base_dir = path.resolve(__dirname);

fs.rmSync(release_dir, { recursive: true, force: true });

fs.mkdirSync(release_dir, { recursive: true });

const zipStream = fs.createWriteStream(`${release_dir}/pmd-${version}.zip`);
const zip = archiver("zip", {
  zlib: { level: 6 },
});
zip.on("error", function (err) {
  console.log("ZIP Error:");
  throw err;
});
const tarStream = fs.createWriteStream(`${release_dir}/pmd-${version}.tar.gz`);
const tar = archiver("tar", {
  zlib: { level: 6 },
});
tar.on("error", function (err) {
  console.log("TAR Error:");
  throw err;
});

zipStream.on("end", function () {
  console.log("ZIP Data has been drained");
});

tarStream.on("end", function () {
  console.log("TAR Data has been drained");
});

zip.pipe(zipStream);

zip.append(fs.createReadStream(path.resolve(base_dir, "LICENSE")), {
  name: "LICENSE",
});
tar.append(fs.createReadStream(path.resolve(base_dir, "LICENSE")), {
  name: "LICENSE",
});

zip.append(fs.createReadStream(path.resolve(base_dir, "apollo.config.js")), {
  name: "apollo.config.js",
});
tar.append(fs.createReadStream(path.resolve(base_dir, "apollo.config.js")), {
  name: "apollo.config.js",
});

zip.append(fs.createReadStream(path.resolve(base_dir, "package.json")), {
  name: "package.json",
});
tar.append(fs.createReadStream(path.resolve(base_dir, "package.json")), {
  name: "package.json",
});

zip.directory(path.resolve(base_dir, "../../template"), "template");
tar.directory(path.resolve(base_dir, "../../template"), "template");

zip.directory(path.resolve(base_dir, "bin"), "bin");
tar.directory(path.resolve(base_dir, "bin"), "bin");

zip.finalize();
tar.finalize();

const upload = async () => {
  // const release = await octokit.request("POST /repos/{owner}/{repo}/releases", {
  //   owner: process.env.REPO_OWNER,
  //   repo: process.env.REPO_NAME,
  //   tag_name: version,
  //   target_commitish: "main",
  //   name: version,
  //   draft: false,
  //   prerelease: false,
  //   generate_release_notes: true,
  //   headers: {
  //     "X-GitHub-Api-Version": "2022-11-28",
  //   },
  // });
  const latestRelease = await octokit.request(
    "GET /repos/{owner}/{repo}/releases/tags/{tag}",
    {
      owner: process.env.REPO_OWNER,
      repo: process.env.REPO_NAME,
      tag: version,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  console.log(latestRelease);
  const assets = await octokit.request(
    "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
    {
      owner: process.env.REPO_OWNER,
      repo: process.env.REPO_NAME,
      release_id: latestRelease.data.id,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  await octokit.request(
    "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name}",
    {
      owner: process.env.REPO_OWNER,
      repo: process.env.REPO_NAME,
      name: "EEEE",
      release_id: latestRelease.data.id,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  console.log(`Release created on GitHub. Version: ${version}`);
  console.log(
    `https://github.com/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/releases/tag/${version}`
  );
};
upload();
