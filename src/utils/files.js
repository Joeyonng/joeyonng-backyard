import FileFolderIcon from "../media/icons/file-folder.png";
import FileImageICon from "../media/icons/file-image.png";
import FileTextIcon from "../media/icons/file-text.png";
import FileOfficeIcon from "../media/icons/file-office.png";
import FileUnknownIcon from "../media/icons/file-unknown.png";

const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg', 'tif', 'tiff'];
const TEXT_TYPES = ['md', 'txt', 'xml', 'html', 'css', 'js', 'jsx', 'c', 'cpp', 'java', 'php', 'py', 'sh', 'swift', 'r', 'jl', '.mat'];
const OFFICE_TYPES = ['docx', 'pptx', 'xlsx', 'doc', 'ppt', 'xls', 'numbers', 'key', 'pages'];

function getFileExtension(filename) {
  if (filename[0] === '.') filename = filename.slice(1);

  const parts = filename.split('.');
  if (parts.length === 1) {
    return "";
  }
  else {
    return parts.pop();
  }
}

function filenameToIcon(filename, isDir) {
  let extension = getFileExtension(filename);
  if (isDir) {
    return FileFolderIcon;
  }

  if (IMAGE_TYPES.includes(extension)) {
    return FileImageICon;
  }

  if (TEXT_TYPES.includes(extension)) {
    return FileTextIcon;
  }

  if (OFFICE_TYPES.includes(extension)) {
    return FileOfficeIcon;
  }

  return FileUnknownIcon;
}

function filenameToApp(filename) {
  let extension = getFileExtension(filename);

  if (extension === 'ipynb') {
    return '2';
  }
  else {
    return '0';
  }

}

// https://gist.github.com/n1ru4l/dc99062577b746e0783410b1298ab897
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  })
}

export {getFileExtension, filenameToIcon, filenameToApp, blobToBase64}