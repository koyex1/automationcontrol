import {HashRouter , BrowserRouter, Route, Routes} from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import HomeScreen from './Screens/HomeScreen';
import ImageScreen from './Screens/ImageScreen';
import HtmlScreen from './Screens/HtmlScreen';
import LogScreen from './Screens/LogScreen';
import './index.css';

function App() {
  return (
    <>
    <ChakraProvider >
    <BrowserRouter >
    <Routes>
    <Route path="/" element={<HomeScreen/>} exact></Route>
    <Route path="/failedHtmlCode" element={<HtmlScreen/>} exact></Route>
    <Route path="/failedImage" element={<ImageScreen/>} exact></Route>
    <Route path="/logReport" element={<LogScreen/>} exact></Route>
    </Routes>
    </BrowserRouter >
    </ChakraProvider>
    </>
  );
}

export default App;
