import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Sun, Wind, Umbrella, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, CloudOff} from "react-feather";
import {Menu, MenuBarButton, Spinner} from "react-big-sur";

import {changeSettings, pushNotification} from "../redux";

import "./WeatherMenu.scss";
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
      if (id_str === '800') return <Sun/>;
      else return <Cloud/>;
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

function WeatherMenu(props) {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    weathers: undefined,
  })

  return (
    <MenuBarButton
      label={
        React.cloneElement(!state.weathers ? <Umbrella/> : state.weathers.icon, {
          onClick: () => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&units=metric&appid=${openWeatherAPIKey}`)
              .then((response) => response.json())
              .then(json => {
                const weather = parseOpenWeather(json)
                setState(state => ({...state, weathers: weather}));
                dispatch(changeSettings('0', {weather: weather.weather}))
                dispatch(pushNotification('0', 'Weather Updated', `Current weather: ${weather.weather}`, false))
              })
              .catch(e => {
                console.log(e)
              })
          }}
        )
      }
      separate={true}
      {...props}
    >
      <Menu
        anchorOriginX="right"
        popoverX="right"
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
      </Menu>
    </MenuBarButton>
  )
}

export default WeatherMenu;
