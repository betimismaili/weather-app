import { useEffect, useState } from "react";
import "./App.css";
import windImage from "/wind.png";

//test comment
function App() {
  const [lat, setLat] = useState([]);
  const [lon, setLong] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });

      if (lat.length === 0 && lon.length === 0) return;

      await fetch(
        `${
          import.meta.env.VITE_BASE_API_URL
        }/weather?lat=${lat}&lon=${lon}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }`
      ).then((data) =>
        data.json().then((result) => {
          setData(result);
        })
      );
    };

    fetchData();
  }, [lat, lon]);

  return (
    <div className="app">
      {typeof data.main != "undefined" ? <Weather data={data} /> : "Loading..."}
    </div>
  );
}

function Weather({ data }) {
  const weatherIconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  const windDeg = data.wind.deg;

  const weatherStyles = {
    transform: "rotate(-45deg)",
  };

  return (
    <div className="card">
      <header>
        Weather in {data.name} -{" "}
        {new Date(data.dt * 1000).toLocaleTimeString("en-IN")}
      </header>
      <div className="weather-body">
        <p>
          <b>Temp: </b> {Math.round(data.main.temp)} &deg;C |{" "}
          <b>Feels like: </b> {Math.round(data.main.feels_like)} &deg;C
        </p>
        <p>
          <b>Max: </b> {Math.round(data.main.temp_max)} &deg;C | <b>Min: </b>{" "}
          {Math.round(data.main.temp_min)} &deg;C
        </p>
        <hr />
        <p>
          <b>Description: </b> {data.weather[0].description}
          <img src={weatherIconUrl} />
        </p>
        <div>
          <b>
            Wind: {data.wind.speed} mph |{" "}
            <div
              style={{
                transform: `rotate(${windDeg}deg)`,
              }}
            >
              <img style={weatherStyles} src={windImage} />
            </div>
          </b>
        </div>
      </div>
    </div>
  );
}

export default App;
