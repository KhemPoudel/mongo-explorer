import { useState } from 'react';
import Connection from './Connection';
import ConnectionsView from './ConnectionsView';

function App() {
  const [ conn, setConn ] = useState(null);
  if(conn) {
    return (
      <ConnectionsView conn={conn} />
    );
  } else {
    return (
      <Connection setConnValue={setConn} />
    )
  }
}

export default App;
