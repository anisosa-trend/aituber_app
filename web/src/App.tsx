import React, { FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TopPage } from './features/Top';
import './App.css';

export const eel = (window as any).eel;
eel.set_host("ws://localhost:8080");

const App: FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TopPage/>} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
