import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Detail from './pages/Detail';
import 'ol/ol.css';
import { HeroUIProvider } from '@heroui/react';

function App() {
  return (
    <HeroUIProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/:id" element={<Detail />} />
        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

export default App;
