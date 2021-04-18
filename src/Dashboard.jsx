import React, { useRef, useEffect } from "react";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";
import {Alert, Button} from 'react-bootstrap';
import ChartsPage from './ChartsPage';
import * as tf from "@tensorflow/tfjs";
import Services from "./services";

function Dashboard(){
  let eyeBlink = 0;
  let distraction = 0;
  let confidence = 1;
  var date = new Date();
    const WebcamStreamCapture = () => {
        
        const webcamRef = React.useRef(null);
        const canvasRef = useRef(null);
        const runFacemesh = async () => {
          // NEW MODEL
          const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
          setInterval(() => {
            detect(net);
          }, 300);
        };
        const detect = async (net) => {
          if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
          ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;
      
            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;
      
            // Set canvas width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
      
            // Make Detections
            // OLD MODEL
            //       const face = await net.estimateFaces(video);
            // NEW MODEL
            const face = await net.estimateFaces({input:video});
            //console.log(face);
            // Face rotation and Eye blink
            
              if (face.length > 0) {
                const { annotations } = face[0];
      
                const [EyeUpperLeftX] = annotations['leftEyeUpper0'][3];
                const [EyeLowerLeftX] = annotations['leftEyeLower0'][4];
                
                const eyePosition = EyeUpperLeftX - EyeLowerLeftX;
                //depends on the eye size
                if(eyePosition<2){
                  //console.log('Eye Blinked')
                  eyeBlink = eyeBlink + 1;
                }
                
                const [topX, topY] = annotations['midwayBetweenEyes'][0];
              
                const [rightX, rightY] = annotations['rightCheek'][0];
                const [leftX, leftY] = annotations['leftCheek'][0];
                
                const bottomX = (rightX + leftX) / 2;
                const bottomY = (rightY + leftY) / 2;
              
                const headDegree = Math.atan((topY - bottomY) / (topX - bottomX));
                if(headDegree < 0){
                  //console.log("Distraction");
                  distraction = distraction + 1;
                }

                confidence = face[0]['faceInViewConfidence'];
              }
             
            // Get canvas context
            const ctx = canvasRef.current.getContext("2d");
            requestAnimationFrame(()=>{drawMesh(face, ctx)});
          }
        };

        //useEffect(()=>{runFacemesh()}, []);

        const mediaRecorderRef = React.useRef(null);
        const [capturing, setCapturing] = React.useState(false);
        const [userBrowserMedia, setUserBrowserMedia] = React.useState(false);
        const [recordedChunks, setRecordedChunks] = React.useState([]);
        
        const handleStartCaptureClick = React.useCallback(() => {
          setCapturing(true);
          runFacemesh();
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
          let sessionid = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
          let data = {
            "faceInfo": {
              "M": {
                "confidence": {
                  "N": ""+confidence+""
                },
                "distraction": {
                  "N": ""+distraction+""
                },
                "eyeBlink": {
                  "N": ""+eyeBlink+""
                }
              }
            },
            "id": {
              "S": ""+sessionid+""
            }
          }
          Services.postFaceDetectionData(data).then((res) => {
            let result = res.data;
            console.log(result)
          });
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
          <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Face Attention Monitor</h4> 
          </div>
          <div class="card-body">
            <Webcam audio={true} ref={webcamRef} onUserMedia={userMedia} onUserMediaError={userMediaError} />
            <canvas ref={canvasRef} style={{position: "absolute", marginLeft: "24%", marginRight: "auto", left: 0, right: 0, textAlign: "center", zindex: 9, width: 640, height: 480, }}/>
            {capturing ? (
                  <div class="container">
                    <button type="button" class="btn btn-lg btn-block btn-outline-primary" onClick={handleStopCaptureClick} >Stop Capture</button>
                    </div>
                ) : userBrowserMedia && (
                  <div class="container">
                  <button class="btn btn-lg btn-block btn-outline-primary" onClick={handleStartCaptureClick} >Start Capture</button>
                </div>
                )}
                {recordedChunks.length > 0 && (
                <button class="btn btn-lg btn-block btn-outline-primary" onClick={handleDownload} >Download</button>
                )}
                {userBrowserMedia ? (<div>Please make sure your face is fit into the box above.</div>) : (<div>
                <Alert variant='danger'>
                    Accessing Camera is Essential for the Application!
                </Alert>
                </div>)}
            </div>
          </div>
          </>
        );
      };
    
    return(
        <div class="jumbotron">
        <WebcamStreamCapture />
            <ChartsPage/>
</div>
    );
    }

export default Dashboard;

