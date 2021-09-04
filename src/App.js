import React from 'react';
import "./styles/app.scss"
import ToolBar from "./components/ToolBar";
import SettingsBar from "./components/SettingsBar";
import Canvas from "./components/Canvas";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

const App = () => {
    return (
        <BrowserRouter>
            <div className='app'>
                <Switch>
                    <Route path='/:id'>
                        <ToolBar/>
                        <SettingsBar/>
                        <Canvas/>
                    </Route>
                    <Redirect to={`f${(+new Date).toString(16)}`}/>
                </Switch>
        </div>
</BrowserRouter>
)
}

export default App;
