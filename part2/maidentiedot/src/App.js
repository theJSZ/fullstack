import axios from 'axios'
import { useState, useEffect } from 'react'

const Country = ({country}) => {
  // console.log(country.languages.values)
  return (
    <div>
      <h1>
        {country.name.common}
      </h1>

      <p>
        capital {country.capital} <br/>
        area {country.area}
      </p>

      <h4>
        languages:
      </h4>

      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>

      <img src={country.flags.png} height={100}/>

      <Weather country={country} />


    </div>
  )
}

const CountryList = ({countries, countryFilter, setCountryFilter}) => {
  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().search(countryFilter.toLowerCase()) != -1)

  if (countriesToShow.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }

  else if (countriesToShow.length === 1) {
    return (
      <Country country={countriesToShow[0]} />
    )
  }

  else {
    return (
      <ul>
        {countriesToShow.map(
          country =>
            <li key={country.name.common}>{country.name.common}
              <button onClick={() => setCountryFilter(country.name.common)}>
                show
              </button>
            </li>)}
      </ul>
    )
  }
}

const Weather = ({country}) => {
  const api_key = process.env.REACT_APP_API_KEY
  const lat = country.capitalInfo.latlng[0]
  const lon = country.capitalInfo.latlng[1]
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
    .then(response => setWeatherData(response.data))
  }, [country])

  if (weatherData != null) {
    const weatherIcon = (weatherData.weather[0].icon)
    return (
      <div>
        <h2>
          Weather in {country.capital}
        </h2>

        temperature {(weatherData.main.temp).toFixed(2)} Celsius <br />
        <img src={`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`} /> <br />
        wind {weatherData.wind.speed} m/s
      </div>
    )
  }

}

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')

  const handleCountryFilterChange = (event) => {
    event.preventDefault()
    setCountryFilter(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data.sort((a, b) => a.name.common.localeCompare(b.name.common)))
        // console.log(response.data)
      })
  }, [])

  return (
    <div>
      <p>find countries
        <input value={countryFilter} onChange={handleCountryFilterChange} />
      </p>

      <CountryList countries={countries} countryFilter={countryFilter} setCountryFilter={setCountryFilter}/>



    </div>


  )

}

export default App;
