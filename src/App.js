import back from './back2.jpeg';
import './App.css';
import Aqi from './Aqi.js';

function App() {
    return (
    <div className = "App"
        style = {
            { backgroundImage: `url(${back})`, height: '120vh' }
        } >
        <Aqi / >
     </div>
    );
}

export default App;