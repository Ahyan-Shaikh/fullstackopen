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

function Country({filtered, initialShowValue}) {

  const [show, setShow] = useState(initialShowValue)
  const [weather, setWeather] = useState({})
  const country = filtered
  const languages = []

  useEffect(() => {
    if (show) {
      const api_key = import.meta.env.VITE_SOME_KEY
      const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}`
    

      axios
      .get(baseUrl)
      .then(response => {
        setWeather(response.data)
        console.log(response.data.weather)
      })
      .catch(error => {
        console.log(error)
      })
    }

  }, [])

  for (let key in country.languages) {
    languages.push(country.languages[key])
  }

  const label = show ? 'hide' : 'show'

  if (!show) {
    return (
      <div>
        {country.name.common}
        <button onClick={() => setShow(!show)}>{label}</button>
      </div>
    )
  }

  
  console.log(weather)
  return <div>
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

    <h2>Weather in {country.capital}</h2>
    {/* <p>Temperature {weather.main.temperature}</p> */}
  </div>
}

function DisplayCountries({ countries, filterCountry, findMatching }) {

  const filteredCountries = [];
 
  if (filterCountry === '') {
    return null
  }

  countries.forEach(country => {
    if (findMatching(country.name.common, filterCountry) === 1) {
      filteredCountries.push(country)
    }
  })

  if (filteredCountries.length > 10) {
    return <p>Too may matches, specify another filter </p>
  }

  if (filteredCountries.length === 1) {
    return <Country filtered={filteredCountries[0]} initialShowValue={true}/>
  }

  return (<div>

   { filteredCountries.map((filteredCountry,index) => <Country key={index} filtered={filteredCountry} initialShowValue={false}/>)}
  </div>)
}

const App = () => {
  
  const [countries, setCountries] = useState(null)
  const [filterCountry, setFilterCountry] = useState('')

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


  const searchCountry = (countryName, pattern) => {

    const countryNameLen = countryName.length
    const patternLen = pattern.length

    const cName = countryName.toString().toLowerCase()
    const patt = pattern.toString().toLowerCase()

    let i, j
    for (i = 0, j = 0; i < countryNameLen; i++) {

      while (j < patternLen) {
        if (cName[i+j] === patt[j]) {
          j++
        } else {
          j = 0
          break
        }
        
      }
    }
    return j >= patternLen ? 1: 0
  }


  return (
    <div>
      <SearchCountries filterCountry={filterCountry} onChangeCountryChange={setFilterCountry}/>
      <DisplayCountries countries={countries} filterCountry={filterCountry} findMatching={searchCountry}/>
    </div>
  )
}

export default App
