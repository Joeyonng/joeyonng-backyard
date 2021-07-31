import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {Github} from "@icons-pack/react-simple-icons";
import {ChevronRight, ChevronLeft} from "react-feather";

import {changeAppData, changeSettings, pushNotification, switchApp} from "../redux";
import {ToolbarButton} from "../ui/Buttons";
import {SidebarWindow} from "../ui/Windows";
import {DropdownList} from "../ui/DropdownList";
import {ListDivider, ListItem, TextItem} from "../ui/ListItem";
import {Spinner} from "../ui/Spinner";
import {formatDateTime} from "../utils/miscellaneous";
import {filenameToApp, filenameToIcon, getFileExtension} from "../utils/files";
import {listFilesFromRepo, listReposFromUser, getFileDetails, getFileInfo} from "../utils/github";

import * as style from "../style";
import "./Finder.scss";

function FinderDetailColumn(props) {
  const [state, setState] = useState({
    info: null,
  });

  useEffect(() => {
    getFileDetails(props.item.username, props.item.repo, props.item.path).then(json => {
      setState(state => ({...state, info: json[0]}));
    });
  }, [props.item]);

  return (
    !state.info ? <div className="finder-spinner"><Spinner/></div> :
      <div className="finder-detail">
        <div className="finder-detail-image">
          <img
            style={{
              height: "100%",
            }}
            src={filenameToIcon(props.item.name)}
            alt={props.item.name}
          />
        </div>

        <div className="finder-detail-text">
          <div className="finder-detail-text-title">{props.item.name}</div>
          <ListItem
            primary={props.item.path}
            tail={<div>{`${props.item.size} kb`}</div>}
          />

          <div className="finder-detail-text-title">Author</div>
          <ListItem
            primary={state.info.author.login}
            tail={<a href={state.info.author.html_url}>{state.info.author.html_url}</a>}
          />

          <div className="finder-detail-text-title">Last commit</div>
          <ListItem
            primary={state.info.commit.author.name}
            tail={<div>{formatDateTime(new Date(state.info.commit.author.date))}</div>}
          />
          <ListDivider/>
          <div>
            <ListItem
              primary={state.info.commit.message}
            />
          </div>
        </div>
      </div>
  )
}

function FinderItemsColumn(props) {
  const dispatch = useDispatch();

  return (
      <div
        className="finder-column"
        onClick={(event) => {
          if (props.onSelectionChange) props.onSelectionChange([])
        }}
      >
        {!props.items ? <div className="finder-spinner"><Spinner size={style.height8}/></div> :
          <div className="finder-column-items">
            {props.items.map((item, index) => (
              <ListItem
                key={index}
                size="small"
                icon={
                  <img
                    width={style.icon1}
                    height={style.icon1}
                    src={filenameToIcon(item.name, item.type === 'dir')}
                    alt={item.name}
                  />
                }
                primary={item.name}
                highlight={props.selectedIndex === index ? (props.isFocused ? "primary" : "secondary") : null}
                onClick={(event) => {
                  event.stopPropagation();
                  if (props.selectedIndex !== index) {
                    if (props.onSelectionChange) props.onSelectionChange([index])
                  }
                }}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  if (item.type !== 'dir') {
                    getFileInfo('Joeyonng', item.repo, item.path).then((json) => {
                      let appId = filenameToApp(item.name);
                      switch (appId) {
                        case '2':
                          let raw_content = atob(json.content);
                          dispatch(switchApp(appId))
                          dispatch(changeAppData(appId, {
                            input: raw_content,
                          }))
                          break;
                        default:
                          dispatch(pushNotification(props.appId, `Unable to open the file`,
                            `No app found for file type ".${getFileExtension(item.name)}"`, false))
                      }
                    }).catch((error) => {
                      dispatch(pushNotification(props.appId, 'Unable to open the file',
                        `Error fetching "${item.name}" from Github`, false))
                    })
                  }
                }}
              />
            ))}
          </div>
        }
      </div>
  )
}

function FinderSidebar(props) {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    repositories: null,
  });

  useEffect(() => {
    listReposFromUser(props.username).then((json) => {
      let newRepositories = []
      for (let repo of json) {
        newRepositories.push(repo.name);
      }
      setState(state => ({...state, repositories: newRepositories}))

      if (newRepositories.length > 0 && props.onSelectionChange) props.onSelectionChange(newRepositories[0], 0);
    }).catch((error) => {
      dispatch(pushNotification(props.appId, 'Error fetching from Github', `Error reading repo list for ${props.username}`, false))
    });
  }, [props.username]);

  return (
    <DropdownList
      title="Github"
      loading={!state.repositories}
    >
      {!state.repositories ? null :
        state.repositories.map((repo, index) => (
          <ListItem
            key={index}
            size="medium"
            icon={<Github size={style.icon1} color={style.blue}/>}
            primary={repo}
            highlight={props.selectedIndex === index ? "secondary" : undefined}
            onClick={() => {
              if (props.selectedIndex !== index) {
                if (props.onSelectionChange) props.onSelectionChange(repo, index);
              }
            }}
          />
        ))
      }
    </DropdownList>
  )
}

function Finder(props) {
  const [state, setState] = useState({
    tree: null,
    repoIndex: null,
    pathIndices: [],
    historyIndex: -1,
  });

  // Setup state history
  const {historyIndex} = state;
  const historyStates = useRef([]);
  const historyStatesPush = (state, historyIndex) => {
    if (historyIndex >= 0) {
      historyStates.current = historyStates.current.slice(0, historyIndex + 1);
    }
    historyStates.current.push(state);
  }
  const {tree, repoIndex, pathIndices} = historyStates.current[historyIndex] ? historyStates.current[historyIndex] : state;

  // Calculate columns based on pathIndices
  let item = null;
  let columns = [{items: tree, parent: item}];
  if (tree) {
    for (let index = 0; index < pathIndices.length; index++) {
      item = columns[columns.length - 1].items[pathIndices[index]];
      columns.push({items: item.children, parent: item});
    }
  }

  return (
    <SidebarWindow
      initial={{x: 100, y: 100, w: 960, h: 640}}
      zIndex={props.zIndex}
      border={props.border}
      focus={props.focus}
      onFocus={props.onFocus}
      enableResizing={true}
      windowState={props.windowState}
      onWindowStateChange={props.onWindowStateChange}
      onCloseClick={props.onCloseClick}
      onMinimizeClick={props.onMinimizeClick}
      onMaximizeClick={props.onMaximizeClick}
      backgroundColor={style.white}
      toolbar={
        <div className="finder-toolbar">
          <ToolbarButton
            icon={<ChevronLeft/>}
            disabled={historyIndex >= 0 ? historyIndex < 1 : historyStates.current.length <= 1}
            onClick={() => {
              let curHistoryIndex = historyIndex >= 0 ? historyIndex : historyStates.current.length - 1;
              setState({tree, repoIndex, pathIndices, historyIndex: curHistoryIndex - 1})
            }}
          />
          <ToolbarButton
            icon={<ChevronRight/>}
            disabled={historyIndex < 0 || historyIndex >= historyStates.current.length - 1}
            onClick={() => {
              setState({tree, repoIndex, pathIndices, historyIndex: historyIndex + 1})
            }}
          />
          <div className="finder-toolbar-title">
            <TextItem
              texts={[...(!item ? [] : [{
                value: item.name,
              }])]}
            />
          </div>
        </div>
      }
      sidebar={
        <div className="finder-sidebar">
          <FinderSidebar
            appId={props.appId}
            username="Joeyonng"
            selectedIndex={repoIndex}
            onSelectionChange={(repo, index) => {
              setState({tree: null, repoIndex, pathIndices: [], historyIndex})
              listFilesFromRepo('Joeyonng', repo).then((newTree) => {
                setState({tree: newTree, repoIndex: index, pathIndices: [], historyIndex: -1})
                historyStatesPush({tree: newTree, repoIndex: index, pathIndices: []}, historyIndex);
              })
            }}
          />
        </div>
      }
    >
      <div className="finder-container">
        {columns.map((column, index) => {
          return (
            column.items === undefined ?
              <FinderDetailColumn
                key={index}
                item={column.parent}
              /> :
              <FinderItemsColumn
                key={index}
                appId={props.appId}
                items={column.items}
                isFocused={index === pathIndices.length - 1}
                selectedIndex={pathIndices[index]}
                onSelectionChange={(selectedIndices) => {
                  if (selectedIndices.length === 0) {
                    if (index !== column.length - 1) {
                      let newPathIndices = pathIndices.slice(0, index);
                      setState({tree, repoIndex, pathIndices: newPathIndices, historyIndex: -1})
                      historyStatesPush({tree, repoIndex, pathIndices: newPathIndices}, historyIndex);
                    }
                  }
                  else if (selectedIndices.length === 1) {
                    let newPathIndices = pathIndices.slice(0, index).concat([selectedIndices[0]]);
                    setState({tree, repoIndex, pathIndices: newPathIndices, historyIndex: -1})
                    historyStatesPush({tree, repoIndex, pathIndices: newPathIndices}, historyIndex);
                  }
                  else {
                  }
                }}
              />
          )
        })}
      </div>
    </SidebarWindow>
  )
}

export default Finder;