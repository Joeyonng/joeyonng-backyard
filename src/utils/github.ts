function githubFetchWithToken(api: string): Promise<Response> {
  return fetch(api);
}

function listReposFromUser(username: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    githubFetchWithToken(`https://api.github.com/users/${username}/repos`)
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => reject(error));
  });
}

type GitHubRepoFileNode = {
  username?: string;
  repo?: string;
  type: string;
  path: string;
  children?: GitHubRepoFileNode[];
  [key: string]: unknown;
};

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
 */
function listFilesFromRepo(username: string, repo: string, path = '/'): Promise<GitHubRepoFileNode[]> {
  return new Promise((resolve, reject) => {
    getFileContent(username, repo, path)
      .then((files) => {
        const fileList = Array.isArray(files) ? files : [];
        const promises = fileList.map(
          (file) =>
            new Promise<GitHubRepoFileNode>((nodeResolve, nodeReject) => {
              const node: GitHubRepoFileNode = { ...file, username, repo };

              if (file.type === 'dir') {
                listFilesFromRepo(username, repo, file.path)
                  .then((children) => {
                    node.children = children;
                    nodeResolve(node);
                  })
                  .catch((error) => nodeReject(error));
              } else {
                nodeResolve(node);
              }
            }),
        );

        Promise.all(promises)
          .then((nodes) => {
            resolve(nodes);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
}

function getFileCommits(username: string, repo: string, path: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    githubFetchWithToken(`https://api.github.com/repos/${username}/${repo}/commits?path=${path}&page=1&per_page=1`)
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => reject(error));
  });
}

function getFileContent(username: string, repo: string, path: string): Promise<GitHubRepoFileNode[] | GitHubRepoFileNode> {
  return new Promise((resolve, reject) => {
    githubFetchWithToken(`https://api.github.com/repos/${username}/${repo}/contents/${path}`)
      .then((response) => response.json())
      .then((json) => resolve(json as GitHubRepoFileNode[] | GitHubRepoFileNode))
      .catch((error) => reject(error));
  });
}

function parseHtmlUrl(htmlUrl: string): { username: string; repoName: string; filename: string } {
  const url = new URL(htmlUrl);
  const names = url.pathname.split('/');

  const username = names[1];
  const repoName = names[2];
  const filename = names[names.length - 1];
  return { username, repoName, filename };
}

export { listReposFromUser, getFileContent, listFilesFromRepo, getFileCommits, parseHtmlUrl };
