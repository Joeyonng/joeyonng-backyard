const {rgba, grey3, black} = require("./src/style");
module.exports = {
  StyleGuide: {
    "@global .row": {
      width: "100%",

      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    "@global .background": {
      background: "url('https://wallpapercave.com/wp/wp6761052.jpg')",
      backgroundSize: "cover",
    },
    "@global .canvas": {
      width: "100%",
      height: 640,
      position: "relative",

      backgroundColor: "#f0f0f0",
    },
    content: {
      maxWidth: "1600px",
    }
  },
  Code: {
    code: {
      backgroundColor: "#f2f2f2",
      padding: "0 10px",
      borderRadius: "5px",
    },
  },
  Ribbon: {
    link: {
      color: "black",
      background: "rgba(242, 242, 242, 0.5)",
      backdropFilter: "blur(80px)",
      boxShadow: "0px 20px 30px rgba(255, 255, 255, 0.2)",
    },
  }
}