import React, {forwardRef, useCallback, useState} from "react";
import PropTypes from "prop-types";

import ColumnView from "./ColumnView";

import "./ColumnViewFactory.scss";

const ColumnViewFactory = forwardRef(function ColumnViewFactoryFunc(props, ref) {
  const {...publicProps} = props;
  const {classNames, styles, children, ...curProps} = publicProps;
  const {tree, path, onChange, ...rootProps} = curProps;

  const [state, setState] = useState({
    containerEl: null,
  })

  const delNode = (path, key) => {
    const newKey = path[key];
    delete path[key];

    if (path[newKey] !== undefined) delNode(newKey, path);
  }

  const parse = (node) => {
    return (typeof node !== 'object' || React.isValidElement(node) ? node :
        <ColumnView
          {...node}
          key={node.id}
          selectedId={path[node.id]}
          onSelect={(id) => {
            if (node.onSelect) node.onSelect(id);

            let curPath = Object.assign({}, path);
            const oldNode = curPath[node.id]
            curPath[node.id] = id;
            delNode(curPath, oldNode);

            if (onChange) onChange(curPath);
          }}
          containerEl={state.containerEl}
        >
          {!node.children ? null : (!Array.isArray(node.children) ? parse(node.children) :
            node.children.map(child => parse(child)))
          }
        </ColumnView>
    )
  }

  const factoryRef = useCallback((node) => {
    if (ref) ref.current = node;
    setState(() => ({...state, containerEl: node}))
  }, []);

  return (
    <div
      {...rootProps}
      ref={factoryRef}
      className="column-view-factory"
    >
      {tree ? parse(tree) : null}
    </div>
  )
});

ColumnViewFactory.propTypes = {
  tree: PropTypes.object,
  path: PropTypes.object,
  onChange: PropTypes.func,
}

ColumnViewFactory.defaultProps = {
  path: {},
}

export default ColumnViewFactory;