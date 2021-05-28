import React from "react";

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
        {this.state.date.toDateString().substr(0, 11) + this.state.date.toLocaleTimeString("en-US")}
      </div>
    );
  }
}

export default Clock
