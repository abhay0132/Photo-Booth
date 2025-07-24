import './App.css';
import CameraSetup from './pages/CameraSetup';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PhotoBooth from './pages/PhotoBooth';
import PreviewPrint from './pages/PreviewPrint';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<CameraSetup/>}/>
    <Route path='/booth' element={<PhotoBooth/>}/>
    <Route path='/preview' element={<PreviewPrint/>}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
