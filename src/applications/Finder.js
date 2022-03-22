import React, {forwardRef, useEffect, useState} from "react";
import {useMeasure} from "react-use";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {Document, Page} from "react-pdf/dist/esm/entry.webpack";
import {Github} from "@icons-pack/react-simple-icons";
import {ChevronRight, ChevronLeft, Meh, Clipboard} from "react-feather";
import {DropdownList, List, ListItem, ListDivider, ToolbarItem, ToolbarWindow, ColumnViewFactory} from "react-big-sur";

import * as style from "../style";
import "./Finder.scss";

import {getFileCommits, getFileContent, listReposFromUser, parseHtmlUrl} from "../utils/github";
import {blobToBase64, filenameToIcon, getFileExtension} from "../utils/files";
import useObjHistory from "../utils/useObjHistory";
import {formatDateTime} from "../utils/miscellaneous";

const USERNAME = 'joeyonng';

function PdfPreview(props) {
  const [ref, {width}] = useMeasure();
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        overflowX: "hidden",
      }}
    >
      <Document
        file={props.content}
      >
        <Page
          pageNumber={1}
          width={width}
        />
      </Document>
    </div>
  )
}

function FilePreview(props) {
  const {name, content} = props

  const type = getFileExtension(name);
  switch(type) {
    case "md":
      return (
        <div className="file-preview">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          >
            {content}
          </ReactMarkdown>
        </div>
      )
    case "pdf":
      return (
        <div className="file-preview">
          <PdfPreview content={content}/>
        </div>
      )
    default:
      return (
        <div className="file-preview">
        <pre
          className="text-file-preview"
        >
          {content}
        </pre>
        </div>
      )
  }
}

function GithubDetail(props) {
  const [state, setState] = useState({
    commit: null,
    content: null,
  });

  useEffect(() => {
    const {username, repoName} = parseHtmlUrl(props.item.html_url);

    getFileContent(username, repoName, props.item.path).then(json => {
      setState(state => ({...state, content: json}));
    })
    getFileCommits(username, repoName, props.item.path).then(json => {
      setState(state => ({...state, commit: json[0]}));
    });
  }, [props.item]);

  return (
    <div className="finder-detail">
      {!state.content ? null : <FilePreview name={state.content.name} content={atob(state.content.content)}/> }
      {!state.commit || !state.content ? null :
        <div className="finder-detail-text">
          <a className="finder-detail-text-title" href={state.content.html_url}>
            {props.item.name}
          </a>
          <ListItem
            variant="disabled"
            primary={props.item.path}
          />

          <div className="finder-detail-text-title">Information</div>
          <List
            size="small"
            variant="disabled"
          >
            <ListItem
              primary="Size"
              tail={
                <div className="finder-detail-text-tail">
                  {`${props.item.size} kb`}
                </div>
              }
            />
            <ListDivider narrow/>
            <ListItem
              primary="Author"
              tail={
                <a className="finder-detail-text-tail" href={state.commit.author.html_url}>
                  {state.commit.author.login}
                </a>
              }
            />
            <ListDivider narrow/>
            <ListItem
              primary="Last commit by"
              tail={
                <div className="finder-detail-text-tail">
                  {state.commit.commit.author.name}
                </div>
              }
            />
            <ListDivider narrow/>
            <ListItem
              primary="Last commit time"
              tail={
                <div className="finder-detail-text-tail">
                  {formatDateTime(new Date(state.commit.commit.author.date))}
                </div>
              }
            />
          </List>
        </div>
      }
    </div>
  )
}

function FavoriteDetail(props) {
  return (
    <div className="finder-detail">
      <FilePreview
        name={props.name}
        content={props.content}
      />
    </div>
  )
}

function GithubSidebar(props) {
  const [state, setState] = useState({
    repositories: null,
  })

  useEffect(() => {
    listReposFromUser(USERNAME).then((json) => {
      const repositories = json.map(repo => repo.name)
      setState(state => ({...state, repositories}));
    }).catch((error) => {
      console.log(error)
    });
  }, [USERNAME]);

  return (
    <DropdownList
      title="Github"
      loading={!state.repositories}
    >
      {!state.repositories ? null :
        state.repositories.map((repo, index) => (
          <ListItem
            key={repo}
            icon={<Github color={style.blue}/>}
            primary={repo}
            variant={props.selected === repo ? 'secondary' : 'normal'}
            onClick={() => {
              if (props.onChange) props.onChange(repo);
            }}
          />
        ))
      }
    </DropdownList>
  )
}

function FavoriteSidebar(props) {
  const labels = ['About', 'Resume']
  const icons = [<Meh color={style.blue}/>, <Clipboard color={style.blue}/>]

  return (
    <DropdownList
      title="Favorites"
    >
      {labels.map((label, index) =>
        <ListItem
          key={index}
          icon={icons[index]}
          primary={label}
          variant={props.selected === label ? 'secondary' : 'normal'}
          onClick={() => {
            if (props.onChange) props.onChange(label);
          }}
        />
      )}
    </DropdownList>
  )
}


function Finder(props, ref) {
  const [state, setState] = useState({
    path: {root: 'About'},
    tree: {},
  })

  const [push, step, check] = useObjHistory();

  const githubPathToTree = (currNodeId='root', currNode=state.tree, rootNode=state.tree, path='') => {
    if (currNode.id !== currNodeId || !currNode.children) {
      // setState before fetching
      currNode.id = currNodeId;
      currNode.loading = true;
      setState(state => ({...state, tree: rootNode}));

      getFileContent(USERNAME, state.path.root, path).then((files) => {
        // setState after fetching
        currNode.loading = false;
        currNode.children = files.map((file) => {
          // Translate format
          const node = {};
          node.id = file.name;
          node.label = file.name;
          node.icon = (<img src={filenameToIcon(file.name, file.type === 'dir')} alt={file.name}/>);
          node.hasArrow = file.type === 'dir';

          if (file.type !== 'dir') {
            node.fillWidth = true;
            node.children = (<GithubDetail key={file.name} item={file}/>)
          }

          return node;
        });
        setState(state => ({...state, tree: rootNode}));

        // Go next level if needed
        const nextNodeId = state.path[currNodeId];
        if (nextNodeId !== undefined) {
          const nextNode = currNode.children.filter((child) => child.id === nextNodeId)[0];
          githubPathToTree(nextNodeId, nextNode, rootNode, `${path}/${nextNodeId}`);
        }
      })
    }
    else {
      // Go next level if needed
      const nextNodeId = state.path[currNodeId];
      if (nextNodeId !== undefined) {
        const nextNode = currNode.children.filter((child) => child.id === nextNodeId)[0];
        githubPathToTree(nextNodeId, nextNode, rootNode, `${path}/${nextNodeId}`);
      }
    }
  }

  useEffect(() => {
    if (state.path.root) {
      const filename = {'About': 'about.md', 'Resume': 'resume.pdf'}[state.path.root];

      if (filename !== undefined) {
        setState(state => ({...state, tree: {id: state.path.root, loading: true}}));

        const path = process.env.PUBLIC_URL + `/files/${filename}`;

        fetch(path).then((input) => {
          if (filename === 'about.md') return input.text();
          else if (filename === 'resume.pdf') return input.blob();
        }).then((input) => {
          if (filename === 'about.md') return input;
          else if (filename === 'resume.pdf') return blobToBase64(input);
        }).then((input) => {
          const tree = {
            id: state.path.root,
            minWidth: 100,
            loading: false,
            fillWidth: true,
            children: <FavoriteDetail name={filename} content={input}/>,
          }
          setState(state => ({...state, tree}));
        })
      }
      else {
        githubPathToTree(state.path.root, state.tree, state.tree);
      }
    }
  }, [state.path])

  return (
    <ToolbarWindow
      ref={ref}
      width="100%"
      height="100%"
      focus={props.focus}
      onCloseClick={props.onCloseClick}
      onMinimizeClick={props.onMinimizeClick}
      onMaximizeClick={props.onMaximizeClick}
      backgroundColor={style.white}
      toolbar={
        <div className="finder-toolbar">
          <ToolbarItem
            variant="deselected"
            disabled={check(true)}
            onClick={() => {
              setState({...state, path: step(-1)})
            }}
          >
            <ChevronLeft/>
          </ToolbarItem>
          <ToolbarItem
            variant="deselected"
            disabled={check(false)}
            onClick={() => {
              setState({...state, path: step(1)})
            }}
          >
            <ChevronRight/>
          </ToolbarItem>
        </div>
      }
      sidebar={
        <div className="finder-sidebar">
          <FavoriteSidebar
            selected={state.path.root}
            onChange={(label) => {
              const path = {root: label};
              push(path);
              setState(state => ({...state, path, tree: {}}));
            }}
          />
          <GithubSidebar
            selected={state.path.root}
            onChange={(repo) => {
              const path = {root: repo};
              push(path);
              setState(state => ({...state, path, tree: {}}));
            }}
          />
        </div>
      }
    >
      <ColumnViewFactory
        tree={state.tree}
        path={state.path}
        onChange={(path) => {
          setState({...state, path})
          push(path);
        }}
      />
    </ToolbarWindow>
  )
}

function FinderMenu(props, ref) {
  return (<div></div>)
}

Finder = forwardRef(Finder);
FinderMenu = forwardRef(FinderMenu);

export {Finder, FinderMenu};