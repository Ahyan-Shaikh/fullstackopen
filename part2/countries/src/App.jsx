import { useEffect, useState } from 'react'
import axios from 'axios'


function SearchCountries({ filterCountry, onChangeCountryChange }) {
  return (
    <div>
      find countries <input type='text'
        value={filterCountry}
        onChange={(e) => {
          console.log('value...', filterCountry)
          onChangeCountryChange(e.target.value)
        }}/>
    </div>
  )
}


function FilterableCountriesData({countries, filterText}) {
  if (filterText === '') {
    return null;
  }

  // list of countries that mataches the filterText
  const filteredCountries = []

  countries.forEach((country, index) => {
    let name = country.name.common
    if (
      name.toLowerCase().indexOf(
        filterText.toLowerCase()) === -1) {
      return;
    }
    filteredCountries.push(country);
  });

  // if no country is founc just return nothing

  if (filteredCountries.length === 0) {
    return null;
  } else if (filteredCountries.length > 10) {
    return <p>Too many matches, please specify another filter</p>
  }
  return < CountriesList countries={filteredCountries} />
}

function CountriesList({countries}) {

  const totalCountries = countries.length;

  const [showInfo, setShowInfo] = useState(Array(totalCountries).fill(false));

  console.log(showInfo)
  if (totalCountries > 1 && totalCountries <= 10) {
    return (
      <>
        {
        countries.map((country, index) => {

          return (showInfo[index]
                    ? <Country key={index} country={country}/>
                    : <p key={index}>
                        {country.name.common}
                        <button onClick={() => {
                          const updatedShowInfo = [...showInfo]
                          updatedShowInfo[index] = true
                          setShowInfo(updatedShowInfo)
                        }}>
                          show
                        </button>
                      </p>
                  )})
        
        }
      </>
    )
  }
  return <Country country={countries[0]} />
}

function Country({country}) {
  const [weather, setWeather] = useState(null);
  const [lat, lon] = country.capitalInfo.latlng;

  useEffect(() => {
    const api_key = import.meta.env.VITE_SOME_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
      
      axios
        .get(url)  
        .then(response => {
          console.log(response.data)
          setWeather(response.data)
        })
        .catch(error => {
          console.log('Unable to fetch weather')
        })
  }, [])

  const languages = []
  for (let key in country.languages) {
    languages.push(country.languages[key])
  }

  return (
      <div>
        <h1>{country.name.common}</h1>       
        <div>
          Capital {country.capital}
          <br />
          Area {country.area}
        </div>

     <h2>Languages</h2>
      <ul>
       {
          languages.map(language => <li key={language}>{language}</li>)
       }
      </ul>
      <picture className='flag'>
        <img src={`${country.flags.svg}`} alt={`${country.flags.alt}`} />
      </picture>

      <Weather weather={weather} city={country.capital}/>
    </div>
    )
}
function Weather({weather, city}) {
  if (!weather){
    return null
  }
  const celcius = weather.main.temp - 273.15;

  return (
    <div>
      <h2>Weather in {city}</h2>
      <p>Temperature {celcius.toPrecision(3)} Celsius</p>
      <img className='icon'src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="" />
      <p> Wind {weather.wind.speed} m/s</p>
    </div>
  )
}


const App = () => {
  
  const [countries, setCountries] = useState(null)
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    const url = 'https://studies.cs.helsinki.fi/restcountries/api'
    axios
      .get(`${url}/all`)
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.log('Uh oh! something went wrong')
      })
  }, [])

  return (
    <div>
      <SearchCountries filterText={filterText} onChangeCountryChange={setFilterText}/>
      <FilterableCountriesData countries={countries} filterText={filterText}/>
    </div>
  )
}

export default App
