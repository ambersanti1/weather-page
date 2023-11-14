var today = dayjs().format("dddd, D MMMM YYYY");
const currentDay=document.querySelector("#currentDay")
currentDay.textContent=today

const inputSearch= document.getElementById("input-search")
const searchBtn=document.getElementById("search-btn")
const weatherContainer=document.querySelector(".weather")
const forecastContainer=document.querySelector(".forecast")
const historyContainer=document.querySelector(".history")

const apiKey='7c2d974f16a011166269a9e79bbe3102'
let cityArray=[]

function getHistory(searchHistory){
  const btn =document.createElement("button")
  btn.setAttribute("class", "btn btn-warning")
  btn.textContent=searchHistory
  historyContainer.append(btn)
}

let searchHistory=JSON.parse(localStorage.getItem("history")) || []
for (let i = 0; i < searchHistory.length; i++) {
  getHistory(searchHistory[i])
}

function getWeather(cityName){
  const url=`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
  fetch(url)
  .then(response =>response.json())
  .then((data)=>{
    console.log(data);
    const lat= data.coord.lat
    const lon=data.coord.lon
    getForecast(lat,lon)
    displayWeather(data)
  })
}

function getForecast(lat, lon){
  const url=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  fetch(url)
  .then(response =>response.json())
  .then((data)=>{
    console.log(data);
    displayForecast(data.list)
    
  })
}

//functions to display API data

function displayWeather(data){
weatherContainer.innerHTML=""

const col = document.createElement("div");
col.setAttribute("class", "col-2");
const card=document.createElement("div")
card.setAttribute("class","card")

const cardHeader=document.createElement("div")
cardHeader.setAttribute("class", "card-header")
const h3= document.createElement("h3")
const span= document.createElement("span")
const icon= document.createElement("img")
icon.setAttribute("src", "https://openweathermap.org/img/w/"+ data.weather[0].icon +".png")
const cardBody=document.createElement("div")
cardBody.setAttribute("class", "card-body")
const temp= document.createElement("p")
const humidity= document.createElement("p")
const wind=document.createElement("p")

h3.textContent= data.name
temp.textContent=`Temperature: ${data.main.temp} Celsius`
humidity.textContent=`Humidity: ${data.main.humidity} %`
wind.textContent=`Wind Speed: ${data.wind.speed} KPH`

//append all items

span.append(icon)
h3.append(span)
cardHeader.append(h3)
cardBody.append( temp, humidity,wind)
card.append(cardHeader, cardBody)
col.append(card)
weatherContainer.append(col)
}

function displayForecast(data){
  forecastContainer.innerHTML=""

  for (let i = 0; i < 6; i++) {
    
    const index= i * 8 + 4
    const day= new Date(data[index].dt*1000).toDateString()

const col= document.createElement("div")
col.setAttribute("class", "col-2")
const card=document.createElement("div")
card.setAttribute("class","card")

const cardHeader=document.createElement("div")
cardHeader.setAttribute("class", "card-header")
const h3= document.createElement("h3")
const span= document.createElement("span")
const icon= document.createElement("img")
icon.setAttribute("src", "https://openweathermap.org/img/w/"+ data[index].weather[0].icon +".png")
const cardBody=document.createElement("div")
cardBody.setAttribute("class", "card-body")
const temp= document.createElement("p")
const humidity= document.createElement("p")
const wind=document.createElement("p")

h3.textContent= day
temp.textContent=`Temperature: ${data[index].main.temp} Celsius`
humidity.textContent=`Humidity: ${data[index].main.humidity} %`
wind.textContent=`Wind Speed: ${data[index].wind.speed} KPH`

//append all items

span.append(icon)
h3.append(span)
cardHeader.append(h3)
cardBody.append( temp, humidity,wind)
card.append(cardHeader, cardBody)
col.append(card)
weatherContainer.append(col)
    
  }

}

function storage(city){
  searchHistory=JSON.parse(localStorage.getItem("history")) || []

  if(!cityArray.includes(city)){
    cityArray.push(city)

    localStorage.setItem("history", JSON.stringify(cityArray))
    getHistory(city)

  }
}
//EventListeners

searchBtn.addEventListener("click", (e)=>{
  e.preventDefault()

  const city= inputSearch.value
  getWeather(city)
  storage(city)
})

historyContainer.addEventListener("click", (e)=>{
  e.preventDefault()
  const cityClicked= this.event.target.textContent
  getWeather(cityClicked)
})

