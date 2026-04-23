import React, {forwardRef, useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {usePrevious} from "react-use";
import {ChevronRight} from "react-feather";

import List from "../lists/List";
import ListItem from "../lists/ListItem";
import Spinner from "../progress-indicators/Spinner";

import "./ColumnView.scss";

const maxWidthOffset = 3;

const ColumnView = forwardRef(function ColumnViewFunc(props, ref) {
  const {id, icon, label, hasArrow, ...publicProps} = props;
  const {classNames, styles, children, ...curProps} = publicProps;
  const {iniWidth, minWidth, fillWidth, selectedId, onSelect, onResize, containerEl, loading, ...rootProps} = curProps;

  const [state, setState] = useState({
    width: iniWidth,
    focused: true,
    isResizing: false,
    selectedId: undefined,
  })

  // sort out ColumnView components and other components
  const items = {};
  const others = [];
  React.Children.forEach(children, item => {
    if (item.type === ColumnView) items[item.props.id] = item;
    else others.push(item);
  });

  // Use controlled selectedId if it changes
  const prevSelectedId = usePrevious(selectedId);
  if (prevSelectedId !== selectedId && state.selectedId !== selectedId) {
    setState({...state, selectedId})
  }

  // Resizing column
  const listRef = useRef(ref);
  const stopResizing = React.useCallback(() => {
    setState(state => ({...state, isResizing: false}));
  }, []);

  const resize = React.useCallback((event) => {
    if (state.isResizing) {
      // Remove all text selections
      window.getSelection().removeAllRanges();

      let mouseX = event.clientX;
      if (containerEl) {
        const containerRect = containerEl.getBoundingClientRect();
        const x1 = containerRect.x + containerRect.width;
        if (mouseX > x1 - maxWidthOffset) mouseX = x1 - maxWidthOffset;
      }

      const listRefRect = listRef.current.getBoundingClientRect();
      const width = mouseX - listRefRect.x;
      setState(state => ({...state, width: width}));

      if (onResize) onResize(width);
    }
  }, [state.isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // TODO Current solution will also scroll vertically if not all area is visible, which is not desirable.
  // Scroll horizontally to the new column
  useEffect(() => {
    if (listRef.current) listRef.current.scrollIntoView({block: "nearest", inline: "end"});
  }, [listRef.current])

  // Calculate the width to fill the remaining space
  useEffect(() => {
    if (listRef.current && containerEl && fillWidth) {
      const listRect = listRef.current.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const x1 = containerRect.x + containerRect.width;
      setState(state => ({...state, width: x1 - listRect.x - maxWidthOffset}))
    }
  }, [listRef.current, containerEl, Object.keys(items).length])

  return (
    <div
      {...rootProps}
      ref={ref}
      className="column-view"
    >
      <div
        ref={listRef}
        className="column"
        style={{
          minWidth: minWidth ? minWidth : "fit-content",
          width: state.width > 0 ? state.width : "fit-content",
        }}
        onClick={(event) => {
          if (event.target === listRef.current) {
            setState({...state, selectedId: undefined})
            if (onSelect) onSelect(undefined);
          }
        }}
      >
        {loading ? <div className="loading"><Spinner/></div> :
          <List size="small">
            {Object.values(items).map((item, index) =>
              <ListItem
                key={index}
                primary={item.props.label}
                icon={item.props.icon}
                tail={!item.props.hasArrow ? null : <ChevronRight width={10} height={10}/>}
                variant={item.props.id === state.selectedId ? (state.focused ? 'primary' : 'secondary') : 'normal'}
                onClick={(event) => {
                  setState({...state, selectedId: item.props.id, focused: true});
                  if (onSelect) onSelect(item.props.id);
                  if (item.props.onClick) item.props.onClick(event);
                }}
              />
            )}
          </List>
        }

        {loading ? null : others}
      </div>

      <div
        className="divider"
        onMouseDown={() => {
          setState({...state, isResizing: true});
        }}
      />

      {loading || !items[state.selectedId] ? null :
        React.cloneElement(items[state.selectedId], {
          iniWidth: state.width,
          containerEl: containerEl,
          onSelect: (selectedId) => {
            setState({...state, focused: selectedId === undefined});
            if (items[state.selectedId].props.onSelect) items[state.selectedId].props.onSelect(selectedId);
          }
        })
      }
    </div>
  )
});

ColumnView.propTypes = {
  /** The id of the ColumnView. */
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The front icon of the ColumnView item appeared in the parent ColumnView. */
  icon: PropTypes.node,
  /** The label string of the ColumnView item appeared in the parent ColumnView. */
  label: PropTypes.string,
  /** If true, a arrow icon will be displayed in the back of the ColumnView item. */
  hasArrow: PropTypes.bool,
  /** If provided, it overwrites the default initial width (the width of the parent ColumnView) of the ColumnView. */
  iniWidth: PropTypes.number,
  /** If provided, it overwrites the default min width (fit-content) of the ColumnView. */
  minWidth: PropTypes.number,
  /** If true and containerEl is provided, the iniWidth will be ignored and the ColumnView will fill the remaining space. */
  fillWidth: PropTypes.bool,
  /** The selected id of the children ColumnView. */
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Callback function fired when a child ColumnView is selected. */
  onSelect: PropTypes.func,
  /** Callback function fired when a ColumnView is resized. */
  onResize: PropTypes.func,
  /**
   * The container of the root ColumnView. If provided, the resizing of the all ColumnViews can be bounded by the
   * boundary of this element. Also, the terminal ColumnView will have the default width to fulfill the remaining area.
   */
  containerEl: PropTypes.instanceOf(Element),
  /** If true, a spinner instead of the children will be displayed. */
  loading: PropTypes.bool,
}

ColumnView.defaultProps = {
  hasArrow: false,
  fillWidth: false,
  loading: false,
}

export default ColumnView;
