import {githubToken} from "../keys";

function githubFetchWithToken(api) {
  return fetch(api, {
    headers: {
      authorization: `token ${githubToken}`
    }
  });
}

function listReposFromUser(username) {
  return new Promise((resolve, reject) => {
    githubFetchWithToken(`https://api.github.com/users/${username}/repos`)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(error => reject(error));
  });
}

function getFileInfo(username, repo, path) {
  return new Promise((resolve, reject) => {
    githubFetchWithToken(`https://api.github.com/repos/${username}/${repo}/contents/${path}`)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(error => reject(error));
  });
}

function listFilesFromRepo(username, repo) {
  const recursiveListFiles = (path) => {
    return getFileInfo(username, repo, path).then((files) => {
      let nodes = [];
      for (let file of files) {
        let node = {
          repo: repo,
          name: file.name,
          type: file.type,
          size: file.size,
          path: file.path,
          username: username,
          download_url: file.download_url
        };

        if (file.type === 'dir') {
          node['children'] = null;
          recursiveListFiles(file.path).then((children) => {
            node['children'] = children;
          });
        }

        nodes.push(node);
      }
      return nodes;
    });
  }

  return recursiveListFiles('/');
}

function getFileDetails(username, repo, path) {
  return new Promise((resolve, reject) => {
    githubFetchWithToken(`https://api.github.com/repos/${username}/${repo}/commits?path=${path}&page=1&per_page=1`)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(error => reject(error));
  });
}


export {listReposFromUser, getFileInfo, listFilesFromRepo, getFileDetails}