import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Box, ChakraProvider, Stack } from '@chakra-ui/react'
import { Header } from './features/Header';
import { TopPage } from './features/Top';
import { ApplicationState } from './features/ApplicationState';
import { VolumeState } from './features/VolumeState';

export const eel = (window as any).eel;
eel.set_host("ws://localhost:8080");

const App: FC = () => {
  return (
    <ChakraProvider>
      <Box position={"fixed"} top={0} left={0} paddingX={2} paddingY={1}>
        <Header/>
      </Box>

      <Stack
        direction={{
          base: "column-reverse",
          md: "row"
        }}
        gap={{
         base: 0,
         md: 2
        }}
        position={"fixed"}
        top={0}
        right={0}
        paddingX={2}
        paddingY={0}
      >
        <VolumeState/>
        <ApplicationState/>
      </Stack>

      <Router>
        <Routes>
          <Route path="/" element={<TopPage/>} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
