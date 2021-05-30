import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Sun, Wind, Umbrella, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, CloudOff} from "react-feather";

import {changeSettings} from "../redux";
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
      return <CloudLightning/>;
    case '3':
      return <CloudDrizzle/>;
    case '5':
      return <CloudRain/>;
    case '6':
      return <CloudSnow/>;
    case '7':
      return <Wind/>;
    case '8':
      if (id_str === '800') {
        return <Sun/>;
      }
      else {
        return <Cloud/>;
      }
    default:
      return <CloudOff/>
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
  const dispatch = useDispatch();
  const [state, setState] = useState({
    weathers: undefined,
    open: false,
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

            fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&units=metric&appid=${openWeatherAPIKey}`)
              .then((response) => response.json())
              .then(json => {
                const weather = parseOpenWeather(json)
                setState(state => ({...state, weathers: weather}));
                dispatch(changeSettings('-1', {weather: weather.weather}))
                console.log('Weather received:', weather)
              })
              .catch(e => {
                console.log(e)
              })
          }}
        >
          {!state.weathers ? <Umbrella/> : state.weathers.icon}
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
