import { Outlet } from 'react-router-dom';
import Navebar from './components/Navebar';

function App() {
  return (
    <div >
      <Navebar/>
      <Outlet/>
    </div>
  );
}

export default App;
