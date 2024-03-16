import { FC, useEffect, useState } from "react";
import axios from "axios";
import { Stack, Text, Image } from "@chakra-ui/react";

type WeatherInformationType = {
  base: string;
  clouds: {
    all: number;
  }
  cod: number;
  coord: {
    lon: number;
    lat: number;
  }
  dt: number;
  id: number;
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  }
  name: string;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  }
  timezone: number;
  visibility: number;
  weather: {
    description: string;
    icon: string;
    id: Number;
    main: string;
  }[],
  wind: {
    speed: number;
    deg: number;
    gust: number;
  }
}

export const Header: FC = () => {
  const [datetime, setDatetime] = useState<string | null>()
  const [weatherInformation, setWeatherInformation] = useState<WeatherInformationType | null>(null);
  
  useEffect(() => {
    const id = setInterval(() => {
      const date = new Date();

      const year = date.getFullYear() ;
      const month = date.getMonth() + 1 ;
      const day = date.getDate() ;
      const dayOfWeek = date.getDay() ;
      const dayOfWeekStr = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
      ][dayOfWeek] ;

      const hour = date.getHours() ;
      const minute = date.getMinutes() ;
      const second = date.getSeconds() ;

      setDatetime(`${year}年${formatDatetime(month)}月${formatDatetime(day)}日(${dayOfWeekStr}) ${formatDatetime(hour)}:${formatDatetime(minute)}:${formatDatetime(second)}`)
    }, 1000);
    return () => {
      clearInterval(id);
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(async(position) => {
        const baseURL = `${process.env.REACT_APP_OPEN_WEATHER_MAP_ENDPOINT}/weather/?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&lang=ja&APPID=${process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY}`;
        await axios.get(baseURL).then((response) => {
          setWeatherInformation(response.data);
        });
      });
    }
    fetchData()
  }, [])

  if(!datetime || !weatherInformation){
    return (
      <Text>情報を取得中です</Text>
    )
  }

  return (
    <Stack direction={"row"} gap={4}>
      <Text>{datetime}</Text>
      <Stack direction={"row"} gap={1}>
        <Stack direction={"row"} gap={0}>
          <Text>{weatherInformation.weather[0].description}</Text>
          <Image src={fetchOpenweathermapImageURL(weatherInformation.weather[0].icon)} alt="" width={6}/>
        </Stack>
        <Text>{Math.round(weatherInformation.main.temp_max)}℃/{Math.round(weatherInformation.main.temp_min)}℃</Text>
      </Stack>
    </Stack>
  )
}

const formatDatetime = (datetime: number) => {
  return datetime.toString().padStart(2, "0")
}

const fetchOpenweathermapImageURL = (iconNum: WeatherInformationType["weather"][0]["icon"]) => {
  return `https://openweathermap.org/img/wn/${iconNum}@2x.png`
}