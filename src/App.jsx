import { useEffect, useState } from "react";
import "./App.css";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { FaWind, FaThermometerHalf } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { TiWeatherSunny, TiWeatherWindyCloudy } from "react-icons/ti";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function App() {
  const [weather, setWeather] = useState([]);
  const [hourlyforcastedWeather, setHourlyForcastedWeather] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [city, setCity] = useState("Delhi");
  const [searchInput, setSearchInput] = useState("");

  const api_key = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCity(searchInput.trim());
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const fetchWeather = async () => {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`
      );

      const usefulData = {
        city: res.data.name,
        temp: res.data.main.temp,
        temp_max: res.data.main.temp_max,
        temp_min: res.data.main.temp_min,
        feels_like: res.data.main.feels_like,
        humidity: res.data.main.humidity,
        condition: res.data.weather[0].description,
        icon: res.data.weather[0].icon,
        wind_speed: res.data.wind.speed,
        lat: res.data.coord.lat,
        lon: res.data.coord.lon,
        date: new Date(res.data.dt * 1000).toLocaleString(),
      };
      setWeather(usefulData);


      // Get 3-hourly forecast (next 5 intervals ~15 hours)
      const resForecast = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${api_key}`
      );
      const hourly = resForecast.data.list.slice(0, 5).map((item) => ({
        time: item.dt_txt,
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      }));
      setHourlyForcastedWeather(hourly);

      const resDailyForecast = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${usefulData.lat}&lon=${usefulData.lon}&appid=${api_key}&units=metric`
      );
      const daily = resDailyForecast.data.list.slice(0, 5).map((item) => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        desc: item.weather[0].description,
      }));
      setDailyForecast(daily);
      console.log(daily);
      console.log(resDailyForecast.data.list);
    };
    if (city) {
      fetchWeather();
    }
  }, [city]);

  return (
    <>
      <Container fluid className="main-1">
        {/* Main Row Start as a Main Conatiner For The Web Page */}
        <Row className="main p-3 sm:p-5">
          {/* Left Side Start*/}
          <Col xl={9} className="middle mr-5">
            <input
              type="text"
              placeholder="search city"
              className="col w-100 p-2 text-white"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
            {/* Left Top Start */}
            <div className="middle-top sm:flex justify-content-between align-items-center p-3">
              <div className="flex justify-content-between sm:flex-col">
                <img
                  className="h-16 w-16"
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt=""
                />
                <h1 className="text-light pb-4">{weather.city}</h1>
                <h1 className="text-light">{Math.round(weather.temp)}°C</h1>
              </div>
              <DotLottieReact
                className="lg:h-76 lg:w-150"
                src="https://lottie.host/4201f2e3-84e3-4b75-a1f2-a3c9bcb3e33f/cQqCG1Uwwp.lottie"
                loop
                autoplay
              />
            </div>
            {/* Left Top End */}

            {/* Left Middle Start */}
            <div className="middle-middle text-light col">
              <h5 className="p-3">
                Today's Forecast
                <DotLottieReact
                  className="lg:h-56 lg:w-100 w-fit mx-auto"
                  src="https://lottie.host/b82395a1-627a-43b0-af0f-0737ddaf0264/7ME97adFaR.lottie"
                  loop
                  autoplay
                />
              </h5>
              <div className="d-flex justify-content-between align-items-center p-3 sm:p-5">
                {hourlyforcastedWeather.map((hour, idx) => (
                  <div className="sm:border-r mx-auto sm:p-3" key={idx}>
                    <p className="text-xs sm:text-sm font-medium mr-2">
                      {new Date(hour.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                      <img
                        src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                        alt=""
                        className="w-10 h-10"
                      />
                      <p className="text-sm sm:text-lg">{hour.temp}°C</p>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Left Middle End */}

            {/* Left Bottom Start */}
            <Row className="middle-bottom col text-light mt-5">
              <Col className="">
                <h4 className="p-3 flex">
                  Air Conditions
                  <DotLottieReact
                    className="h-26 w-36"
                    src="https://lottie.host/41b6aca4-d171-43b3-a9d5-d4a4701b6a45/P78S9hICLT.lottie"
                    loop
                    autoplay
                  />
                </h4>
              </Col>
              <Row className="m-2">
                <Col>
                  <h5 className="flex">
                    <FaThermometerHalf />
                    <p className="text-sm sm:text-xl"> Feels Like</p>
                  </h5>
                  <h1 className="ms-2">
                    <p className="text-lg">
                      {Math.round(weather.feels_like)}°C
                    </p>
                  </h1>
                </Col>
                <Col>
                  <h4 className="flex">
                    {" "}
                    <FaWind />
                    <p className="text-sm sm:text-xl"> Wind</p>
                  </h4>
                  <h1>
                    <p className="text-lg">
                      {Math.round(weather.wind_speed)} km/h
                    </p>
                  </h1>
                </Col>
              </Row>
              <Row className="m-2 pb-5">
                <Col>
                  <h4 className="flex">
                    {" "}
                    <WiHumidity />{" "}
                    <p className="text-sm sm:text-xl">Humidity</p>
                  </h4>
                  <h1>
                    <p className="text-lg">{Math.round(weather.humidity)}</p>
                  </h1>
                </Col>
                <Col>
                  <h4 className="flex">
                    <TiWeatherSunny />{" "}
                    <p className="text-xs sm:text-xl"> Weather Condition</p>
                  </h4>
                  <h1 className="capitalize">
                    <p className="text-lg">{weather.condition}</p>
                  </h1>
                </Col>
              </Row>
            </Row>
            {/* Left Bottom End */}

            {/* Left The Wether App Heading Conatainer Start */}
            <Row className="mt-3 bottom">
              <Col className="bottom-main">
                <Row>
                  <Col
                    xs={6}
                    className="bottom-right col text-light bg-red-200"
                  >
                    <DotLottieReact
                      src="https://lottie.host/eafa6d6a-7fcc-4b17-ac7b-5d013bca1538/2x6Ocg07Gw.lottie"
                      loop
                      autoplay
                    />
                  </Col>

                  <Col className="bg-red-200 flex flex-col justify-content-center bg-red-200 leading-none	 ">
                    <p className="sm:text-4xl text-light font-medium">The</p>
                    <p className="sm:text-4xl text-blue-200 font-medium ml-[1rem] sm:ml-[3rem]">
                      Weather
                    </p>
                    <p className="sm:text-4xl text-light font-medium ml-[4rem] sm:ml-[10rem]">
                      App
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* Left The Wether App Heading Conatainer End */}
          </Col>
          {/* Left Side End */}

          {/* Right Side Start */}
          <Col className="right mt-5 lg:mt-0 ">
            <h2 className="text-light text-center mt-3">15 Hours Forecast</h2>
            <hr />
            <h4 className="text-light text-center mt-3">
              {dailyForecast.length > 0 &&
                new Date(dailyForecast[0].dt * 1000).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
            </h4>
            <div className="daily-forcast grid grid-cols-3 gap-3 sm:flex lg:flex-col ">
              {dailyForecast.map((day, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded shadow text-center mt-5 mb-3 sm:w-1/2 sm:mr-3 lg:w-auto lg:mr-0 bg-orange-200"
                >
                  <p className="font-medium text-sm text-black-900">
                    {new Date(day.dt * 1000).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.desc}
                    className="w-10 h-10 mx-auto"
                  />
                  <p className="text-lg font-semibold">{day.temp}°C</p>
                  <p className="text-xs capitalize">{day.desc}</p>
                </div>
              ))}
            </div>
          </Col>
          {/* Right Side End */}
        </Row>
        {/* Main Row End as a Main Conatiner For The Web Page */}

        {/* Footer Start */}
        <div>
          <p className="footer text-center m-0 p-3 text-xs ">
            Designed & Developed By{" "}
            <a href="https://www.linkedin.com/in/kunal-raj-pal" target="_blank">
              Kunal Raj Pal
            </a>
          </p>
        </div>
        {/* Footer End */}
      </Container>
    </>
  );
}

export default App;
