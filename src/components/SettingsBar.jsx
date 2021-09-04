import React from 'react';
import toolState from "../store/toolState";


const SettingsBar = () => {
    return (
        <div className='setting-bar'>
            <label htmlFor="line-width">Толщина линии</label>
            <input onChange={(event) => toolState.setLineWidth(event.target.value)}
                style={{margin: '0 10px'}}
                   id='line-width'
                   type="number"
                   min={1} max={50}
                   defaultValue={1}/>
            <label htmlFor="stroke-color">Цвет обводки</label>
            <input onChange={(event) => {toolState.setStrokeColor(event.target.value)}} type="color" id='stroke-color'/>
        </div>
    );
};

export default SettingsBar;