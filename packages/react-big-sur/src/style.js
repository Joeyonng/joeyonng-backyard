export const rgba = (rgb, opacity) => {
  const numbers = rgb.match(/\d+/g);
  return `rgba(${numbers[0]}, ${numbers[1]}, ${numbers[2]}, ${opacity})`;
}

export const delPx = (px) => {
  if (px.slice(-2).toLowerCase() !== 'px') {
    return px;
  }
  return Number(px.substring(0, px.length - 2));
}

export const addPx = (num) => {
  if (typeof num !== 'number') {
    return num;
  }
  return String(num + 'px');
}

export const red = "rgb(255, 59, 48)";
export const pink = "rgb(255, 45, 85)";
export const orange = "rgb(255, 149, 0)";
export const yellow = "rgb(255, 204, 0)";
export const green = "rgb(52, 199, 89)";
export const teal = "rgb(90, 200, 250)";
export const blue = "rgb(0, 122, 255)";
export const indigo = "rgb(88, 86, 214)";
export const purple = "rgb(175, 82, 222)";
export const black = "rgb(0, 0, 0)";
export const white = "rgb(255, 255, 255)";

export const grey1 = "rgb(121, 121, 121)";
export const grey2 = "rgb(229, 229, 229)";
export const grey3 = "rgb(242, 242, 242)";
export const transparent = rgba(white, 0);

export const radius1 = "20px";
export const radius2 = "10px";
export const radius3 = "6px";
export const radius4 = "4px";

export const length1 = "80px";
export const length2 = "64px";
export const length3 = "48px";
export const length4 = "38px";
export const length5 = "32px";
export const length6 = "28px";
export const length7 = "26px";
export const length8 = "24px";
export const length9 = "22px";
export const length10 = "20px";
export const length11 = "16px";
export const length12 = "14px";
export const length13 = "12px";
export const length14 = "6px";
export const length15 = "4px";

export const space1 = "18px";
export const space2 = "14px";
export const space3 = "12px";
export const space4 = "10px";
export const space5 = "8px";
export const space6 = "6px";
export const space7 = "4px";
export const space8 = "2px";

export const font1 = "26px";
export const font2 = "22px";
export const font3 = "17px";
export const font4 = "13px";
export const font5 = "12px";
export const font6 = "11px";
export const font7 = "8px";

export const icon1 = "16px";
export const icon2 = "12px";
export const icon3 = "8px";

export const fontWeight1 = "700";
export const fontWeight2 = "400";
export const fontWeight3 = "100";

export const titleBarHeight = "28px";
export const toolbarHeight = "52px";
export const menuBarHeight = "24px";
export const dockHeight = "72px";
export const controlsWidth = "300px";
export const columnWidth = "200px";
export const notificationWidth = "346px";
export const widgetGap = "16px";
export const widgetLarge = "344px";
export const widgetSmall = "164px";
export const widgetsWidth = `${delPx(notificationWidth) + 2 * delPx(widgetGap)}px`;
export const widgetsHeight = `calc(100vh  - ${menuBarHeight} - ${dockHeight})`;

export const minAppZIndex = "0";
export const maxAppZIndex = "99999";

export const unitPx = "1px";
export const border = `${unitPx} solid ${grey2}`;
export const divider1 = `${unitPx} solid ${black}`;
export const divider2 = `${unitPx} solid ${grey2}`;
export const filterBlur = "blur(10px)";
export const filterDarken = "brightness(0.9)";
export const filterUnFocus = "contrast(0.9)";

export const shadow1 = `0px 20px 30px ${rgba(black, 0.2)}`;
export const shadow2 = `0px 10px 20px ${rgba(black, 0.1)}`;
export const shadow3 = `0px 2px 10px ${rgba(black, 0.1)}`;
export const shadow4 = `0px 0.5px 1px 0.5px ${rgba(black, 0.1)}`;

export const glassBackground = () => ({
  background: rgba(grey3, 0.5),
  backdropFilter: "blur(80px)",
});