import React, {useState, useEffect} from 'react';
import Blog from './components/Blog';
// import io from 'socket.io-client'
// import './App.css'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import AdminPage from './components/AdminPage';
import PageNotFound from './components/PageNotFound';
import PostDetail from './components/PostDetail';

const App = () => {

  return (
    // <div>
    //   <Blog/>
    // </div>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Blog} />
        <Route exact path='/posts/:id' component={PostDetail} />
        <Route exact path="/admin" component={AdminPage} />
        <Route component={PageNotFound}/>
      </Switch>
    </BrowserRouter>
  );
};

export default App;