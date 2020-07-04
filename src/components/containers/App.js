import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Player from "./Player";
import GlobalStyle from "../styles/GlobalStyle";

const App = () => (
  <BrowserRouter>
    <>
      <Switch>
        <Route exact path="/" component={Player} />
        <Route exact path="/:activeVideo" component={Player} />
      </Switch>
      <GlobalStyle />
    </>
  </BrowserRouter>
);

export default App;
