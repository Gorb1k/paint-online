import React, {useEffect, useRef, useState} from 'react';
import '../styles/canvas.scss'
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import axios from "axios";

const Canvas = observer( () => {
    const canvasRef = useRef()
    const [usernameField, setUsernameField] = useState('')
    const [modal, setModal] = useState(true)
    const params = useParams()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`).then((response) => {
            const img = new Image()
            img.src = response.data
            img.onload = () => {
                ctx.clearRect(0,0,canvasRef.current.width, canvasRef.current.height)
                ctx.drawImage(img, 0,0,canvasRef.current.width, canvasRef.current.height)
            }
        })
    },[])
    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000/')
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                console.log('подключение установлено')
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: 'connection'
                }))
            }
            socket.onmessage = (e) => {
                let msg = JSON.parse(e.data)
                console.log(msg)
                switch (msg.method) {
                    case 'connection':
                        console.log(`позьзователь с ником ${msg.username} подключился к сессии: ${msg.id}`)
                        break
                    case 'draw':
                        drawHandler(msg)
                        break
                }
            }
        }
    },[canvasState.username])

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`,{img: canvasRef.current.toDataURL()})
            .then((response) => {
                console.log(response.data)})
    }
    const connectionHandler = () => {
      canvasState.setUsername(usernameField)
        setModal(false)
    }
    const drawHandler = (message) => {
        const figure = message.figure
        console.log(figure)
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y)
                break
            case 'rect':
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
                break
            case 'finish':
                ctx.beginPath()
                break
        }
    }

    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header closeButton>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" value={usernameField} onChange={(event) => setUsernameField(event.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={connectionHandler}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={mouseDownHandler} ref={canvasRef} width={600} height={400}/>
        </div>
    );
});

export default Canvas;