import React, {useState, useEffect} from 'react';
import Blog from './components/Blog';
// import io from 'socket.io-client'
// import './App.css'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import AdminPage from './components/AdminPage';

const App = () => {

  return (
    // <div>
    //   <Blog/>
    // </div>
    <BrowserRouter>
      <Switch>
        <Route exact path="/admin" component={AdminPage} />
        <Route exact path="/" component={Blog} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;