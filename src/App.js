// import logo from './logo.svg';
import './App.css';



import {
  BrowserRouter,
  Routes,
  Route, 
} from "react-router-dom";



 
import { EventForm, EventList } from './components';
import { useEventList } from './machines';
import { objectPath } from './util/objectPath';
import { SectionHead , TextIcon, Spacer } from './styled'; 
  


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Application />} />
        <Route path="/list/*" element={<Application />} />
        <Route path="/find/*" element={<Application />} />
        <Route path="/edit/:id" element={<Application />} /> 
      </Routes>
    </BrowserRouter>
  );
}




function Application() { 
  const events = useEventList() 


  
  return (
    <div className="App">
    <SectionHead sx={{p: 1}}>
      EventBuilder POC

    <Spacer />
{objectPath(events.state.value)}
    <TextIcon icon="Settings"  
      onClick={() => {
        events.send({
        type: 'CHANGE',
        key: 'showJSON',
        value: !events.props.showJSON
      })
    }}
      />

    </SectionHead>

    {['listing', 'searching'].some(events.state.matches) && <EventList handler={events} />}
    {['editing'].some(events.state.matches) && <EventForm handler={events} />}

 
    </div>
  );
}

export default App;
