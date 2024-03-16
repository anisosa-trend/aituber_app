import React, { FC } from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './features/Header';
import { TopPage } from './features/Top';
import './App.css';


export const eel = (window as any).eel;
eel.set_host("ws://localhost:8080");

const App: FC = () => {
  return (
    <ChakraProvider>
      <Box position={"fixed"} top={0} left={0} width={"100%"} paddingX={2} paddingY={1}>
        <Header/>
      </Box>

      <Router>
        <Routes>
          <Route path="/" element={<TopPage/>} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
