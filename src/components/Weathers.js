import React, {useEffect, useState} from "react";
import SunSvg from "feather-icons/dist/icons/sun.svg";
import WindSvg from "feather-icons/dist/icons/wind.svg";
import UmbrellaSvg from "feather-icons/dist/icons/umbrella.svg";
import CloudSvg from "feather-icons/dist/icons/cloud.svg";
import CloudRainSvg from "feather-icons/dist/icons/cloud-rain.svg";
import CloudDrizzleSvg from "feather-icons/dist/icons/cloud-drizzle.svg";
import CloudLightningSvg from "feather-icons/dist/icons/cloud-lightning.svg";
import CloudSnowSvg from "feather-icons/dist/icons/cloud-snow.svg";
import CloudOffSvg from "feather-icons/dist/icons/cloud-off.svg";

import {AnchorPopover} from "../ui/Popover";
import {Button} from "../ui/Buttons";

import "./Weathers.scss";
import Spinner from "../ui/Spinner";
import {openWeatherAPIKey} from "../keys";

const zipCode = '92056'
const countryCode = 'us'

const openWeatherIdIcon = (id) => {
  const id_str = String(id);
  const first = id_str.substr(0, 1);

  switch (first) {
    case '2':
      return <img src={CloudLightningSvg} alt=""/>;
    case '3':
      return <img src={CloudDrizzleSvg} alt=""/>;
    case '5':
      return <img src={CloudRainSvg} alt=""/>;
    case '6':
      return <img src={CloudSnowSvg} alt=""/>;
    case '7':
      return <img src={WindSvg} alt=""/>;
    case '8':
      if (id_str === '800') {
        return <img src={SunSvg} alt=""/>;
      }
      else {
        return <img src={CloudSvg} alt=""/>;
      }
    default:
      return <img src={CloudOffSvg} alt=""/>
  }
}

const parseOpenWeather = (json) => {
  return {
    weather: json.weather[0].main,
    min_temp: Math.round(json.main.temp_min),
    max_temp: Math.round(json.main.temp_max),
    temp: Math.round(json.main.temp),
    name: json.name,
    icon: openWeatherIdIcon(json.weather[0].id),
  }
}

function Weathers(props) {
  const [state, setState] = useState({
    weathers: undefined,
    open: false,
  })

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&units=metric&appid=${openWeatherAPIKey}`)
      .then((response) => response.json())
      .then(json => {
        setState(state => ({...state, weathers: parseOpenWeather(json)}));
        // dispatch(changeSettings('-1', {weather: weather}))
      })
  })

  return (
    <AnchorPopover
      open={state.open}
      onClose={() => {
        setState({...state, open: false})
      }}
      anchorDir="y"
      anchor={
        <Button
          onClick={() => {
            setState({...state, open: true})
          }}
        >
          {!state.weathers ? <img src={UmbrellaSvg} alt=""/> : state.weathers.icon}
        </Button>
      }
    >
      <div className="weathers">
        {!state.weathers ? <div className="loading"><Spinner/></div> :
          <div className="info">
            <div className="info-left">
              <div className="name">
                {state.weathers.name}
              </div>
              <div className="temp">
                {`${state.weathers.temp}\xb0`}
              </div>
            </div>
            <div className="info-right">
              <div className="icon">
                {state.weathers.icon}
              </div>
              <div className="temps">
                <div>
                  {state.weathers.weather}
                </div>
                <div>
                  {`H:${state.weathers.max_temp}\xb0 L:${state.weathers.min_temp}\xb0`}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </AnchorPopover>
  )
}

export default Weathers;
