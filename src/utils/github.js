function githubFetchWithToken(api) {
  return fetch(api);
}

function listReposFromUser(username) {
  return new Promise((resolve, reject) => {
    githubFetchWithToken(`https://api.github.com/users/${username}/repos`)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(error => reject(error));
  });
}

/**
 * Return a list of files in the repo that has the following structure:
 * [{
 *  repo: string,
 *  name: string,
 *  type: string,
 *  size: number,
 *  path: string,
 *  git_url: string,
 *  html_url: string,
 *  download_url: string,
 *  children: [{...}, {...}, ...]
 * }]
 * @param username
 * @param repo
 * @param path
 * @return {Promise<*[]>}
 */
function listFilesFromRepo(username, repo, path='/') {
  return new Promise((resolve, reject) => {
    getFileContent(username, repo, path).then((files) => {
      const promises = files.map((file) => new Promise((resolve, reject) => {
        const node = Object.assign({}, file);
        node['username'] = username;
        node['repo'] = repo;

        if (file.type === 'dir') {
          listFilesFromRepo(username, repo, file.path).then((children) => {
            node['children'] = children;
            resolve(node);
          }).catch(error => reject(error));
        }
        else {
          resolve(node);
        }
      }))

      Promise.all(promises).then((nodes) => {
        resolve(nodes);
      }).catch(error => reject(error));
    });
  });
}

function getFileCommits(username, repo, path) {
  return new Promise((resolve, reject) => {
    githubFetchWithToken(`https://api.github.com/repos/${username}/${repo}/commits?path=${path}&page=1&per_page=1`)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(error => reject(error));
  });
}

function getFileContent(username, repo, path) {
  return new Promise((resolve, reject) => {
    githubFetchWithToken(`https://api.github.com/repos/${username}/${repo}/contents/${path}`)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(error => reject(error));
  });
}

function parseHtmlUrl(htmlUrl) {
  const url = new URL(htmlUrl);
  const names = url.pathname.split('/');

  const username = names[1]
  const repoName = names[2]
  const filename = names[names.length - 1]
  return {username, repoName, filename};
}

export {listReposFromUser, getFileContent, listFilesFromRepo, getFileCommits, parseHtmlUrl}