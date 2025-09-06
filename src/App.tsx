import { BrowserRouter as Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Detail from './pages/Detail';
import 'ol/ol.css';
import {HeroUIProvider} from "@heroui/react";


function App() {
  return (
    <HeroUIProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:id" element={<Detail />} />
      </Routes>
    </HeroUIProvider>
  );
}

export default App
