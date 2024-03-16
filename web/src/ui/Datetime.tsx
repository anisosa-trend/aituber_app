import { Box, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react"

export const Datetime: FC = () => {
  const [datetime, setDatetime] = useState<string | null>(null)

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

  return (
    <Text>{datetime}</Text>
  )
}

const formatDatetime = (datetime: number) => {
  return datetime.toString().padStart(2, "0")
}