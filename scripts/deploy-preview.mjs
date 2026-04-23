import ghpages from 'gh-pages';

const branchName = process.env.PREVIEW_BRANCH || process.env.GITHUB_REF_NAME;
const explicitDest = process.env.PREVIEW_DEST;

if (!branchName) {
  console.error('Missing PREVIEW_BRANCH (or GITHUB_REF_NAME) environment variable.');
  process.exit(1);
}

const safeBranchName = branchName.replace(/[^a-zA-Z0-9._-]/g, '-');
const dest = explicitDest || `previews/${safeBranchName}`;

console.log(`Publishing dist/ to gh-pages:${dest}`);

ghpages.publish('dist', {
  branch: 'gh-pages',
  dest,
  dotfiles: true,
  message: `Preview deploy for ${branchName}`,
}, (error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`Preview available at /joeyonng-backyard/${dest}/`);
});
