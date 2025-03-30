import './App.css';
import Character from './characters/Character';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Character Sheet</h1>
      </header>
      <section className="App-section">
        <Character />
      </section>
    </div>
  );
}

export default App;
