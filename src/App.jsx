import {useState} from 'react'
import './App.css'

import ClearIcon from './assets/Clear.jpeg'
import CloudIcon from './assets/Cloud.jpeg'
import DrizzleIcon from './assets/Drizzle.jpeg'
import HumidityIcon from './assets/Humidity.jpeg'
import RainIcon from './assets/Rain.jpeg'
import SearchIcon from './assets/Search.jpeg'
import SnowIcon from './assets/Snow.jpeg'
import WindIcon from './assets/Wind.jpeg'

const WeatherDetails = ({icon,city,temp,country,lat,log,humidity,wind}) => {
  return(
    <>
      <div className='image'>
        {icon ? (
          <img src={icon} alt='Weather icon' />
        ) : (
          <p className='img-text'>Search city to get weather report</p>
        )}
      </div>
      <div className='temp'>{temp}&#8451;</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={HumidityIcon} className='icon' />
          <div className='data'>
            <div className='humidity-percent'>{humidity}%</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={WindIcon} className='icon' />
          <div className='data'>
            <div className='wind-percent'>{wind} km/hr</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

const App = () => {

  let apiKey = "ba63af5ccac0c4e9abb8868789a5c35c"
  const [input,setInput] = useState('')
  const [icon,setIcon] = useState(null)
  const [temp,setTemp] = useState(0)
  const [city,setCity] = useState('')
  const [country,setCountry] = useState('')
  const [lat,setLat] = useState(0)
  const [log,setLog] = useState(0)
  const [humidity,setHumidity] = useState(0)
  const [wind,setWind] = useState(0)
  const [cityNotFound,setCityNotFound] = useState(false)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)

  const weatherIconMap = {
    "01d": ClearIcon,
    "01n": ClearIcon,
    "02d": CloudIcon,
    "02n": CloudIcon,
    "03d": DrizzleIcon,
    "03n": DrizzleIcon,
    "04d": DrizzleIcon,
    "04n": DrizzleIcon,
    "09d": RainIcon,
    "09n": RainIcon,
    "10d": RainIcon,
    "10n": RainIcon,
    "13d": SnowIcon,
    "13n": SnowIcon,
  }


  const Search = async() => {
    setLoading(true)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === "404"){
        console.error("City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return
      }

      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLog(data.coord.lon)
      setCityNotFound(false)

      const weatherIcon = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIcon] || ClearIcon)
    }catch(error){
      console.error("An error occured:", error.message);
      setError("An error occurred while fetching weather data.");
    }finally{
      setLoading(false);
    }
  }

  function handleCity(e) {
    setInput(e.target.value)
  }

  function handleKeyDown(e){
    if(e.key === "Enter"){
      Search();
    }
  };

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input className='cityInput' placeholder='Search City' type='text' onChange={handleCity} value={input} onKeyDown={handleKeyDown} />
          <div className='search-icon' onClick={() => Search()}>
            <img src={SearchIcon} alt='Search' />
          </div>
        </div>

        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City Not Found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} /> }
        

        <p className='copyright'>
          Designed by <span>Barath</span>
        </p>

      </div>
    </>
  )
}

export default App
