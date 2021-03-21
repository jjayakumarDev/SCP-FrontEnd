import React, {useState} from "react";
import {Alert, Button, Modal} from 'react-bootstrap';
import ChartsPage from './ChartsPage';
import Webcam from 'react-webcam';

function Dashboard(){

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const WebcamStreamCapture = () => {
        const webcamRef = React.useRef(null);
        const mediaRecorderRef = React.useRef(null);
        const [capturing, setCapturing] = React.useState(false);
        const [userBrowserMedia, setUserBrowserMedia] = React.useState(false);
        const [recordedChunks, setRecordedChunks] = React.useState([]);
      
        const handleStartCaptureClick = React.useCallback(() => {
          setCapturing(true);
          mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
          });
          mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
          );
          mediaRecorderRef.current.start();
        }, [webcamRef, setCapturing, mediaRecorderRef]);
      
        const handleDataAvailable = React.useCallback(
          ({ data }) => {
            if (data.size > 0) {
              setRecordedChunks((prev) => prev.concat(data));
            }
          },
          [setRecordedChunks]
        );
      
        const handleStopCaptureClick = React.useCallback(() => {
          mediaRecorderRef.current.stop();
          setCapturing(false);
        }, [mediaRecorderRef, webcamRef, setCapturing]);
      
        const handleDownload = React.useCallback(() => {
          if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
              type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            setRecordedChunks([]);
          }
        }, [recordedChunks]);

        const userMedia = React.useCallback(() => {
            setUserBrowserMedia(true);
        });

        const userMediaError = React.useCallback(() => {
            setUserBrowserMedia(false);
        });

        return (
          <>
                <Webcam audio={true} ref={webcamRef} onUserMedia={userMedia} onUserMediaError={userMediaError} />
                {capturing ? (
                <Button onClick={handleStopCaptureClick} variant="danger">Stop Capture</Button>
                ) : userBrowserMedia && (
                <Button onClick={handleStartCaptureClick} variant="success" >Start Capture</Button>
                )}
                {recordedChunks.length > 0 && (
                <Button onClick={handleDownload} variant="success" >Download</Button>
                )}
                {userBrowserMedia ? (<div>camera on</div>) : (<div>
                    <Alert variant='danger'>
                Accessing Camera is Essential for the Application!<br/>
                <Button onClick={handleShow} variant="primary" >Allow Camera Access</Button>
            </Alert>
                </div>)}
          </>
        );
      };
    
    return(
        <div class="jumbotron">
        <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Camera Access</Modal.Title>
      </Modal.Header>
      <Modal.Body>Attention Monitor would like to access your Camera!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
        <WebcamStreamCapture />

        <div class="row w-100">
                <div class="col-md-3">
                    <div class="card border-info mx-sm-1 p-3">
                        <div class="card border-info shadow text-info p-3 my-card"><span class="fa fa-car" aria-hidden="true"></span></div>
                        <div class="text-info text-center mt-3"><h4>Eye Blink Count</h4></div>
                        <div class="text-info text-center mt-2"><h1>234</h1></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-success mx-sm-1 p-3">
                        <div class="card border-success shadow text-success p-3 my-card"><span class="fa fa-eye" aria-hidden="true"></span></div>
                        <div class="text-success text-center mt-3"><h4>Head Rotation Count</h4></div>
                        <div class="text-success text-center mt-2"><h1>9332</h1></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-danger mx-sm-1 p-3">
                        <div class="card border-danger shadow text-danger p-3 my-card"><span class="fa fa-heart" aria-hidden="true"></span></div>
                        <div class="text-danger text-center mt-3"><h4>Distraction Count</h4></div>
                        <div class="text-danger text-center mt-2"><h1>346</h1></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-warning mx-sm-1 p-3">
                        <div class="card border-warning shadow text-warning p-3 my-card"><span class="fa fa-inbox" aria-hidden="true"></span></div>
                        <div class="text-warning text-center mt-3"><h4>Confident Level</h4></div>
                        <div class="text-warning text-center mt-2"><h1>346</h1></div>
                    </div>
                </div>
            </div>
            <ChartsPage/>
</div>
    );
    }

export default Dashboard;

