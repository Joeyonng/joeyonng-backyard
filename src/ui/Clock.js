import React from "react";

import {formatDateTime} from "../utils/miscellaneous";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
        this.setState({
          date: new Date()
        });
      }, 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div className="clock">
        {formatDateTime(this.state.date)}
      </div>
    );
  }
}

export default Clock
