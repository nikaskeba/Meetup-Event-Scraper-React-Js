import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MeetupDisplay from './MeetupDisplay';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Meetup Events</h1>
      </header>
      <MeetupDisplay />
    </div>
  );
}

export default App;
