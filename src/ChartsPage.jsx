import React from "react";
import { Pie } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {Alert, Button} from 'react-bootstrap';
import Services from "./services";

class ChartsPage extends React.Component {
  state = {
    eyeBlink : '0',
    distraction : '0',
    confidence : '1',
    dataPie: ''
  }

  componentDidMount(){
    let pie = {
      labels: ["Eye Rest Level", "Distraction Level", "Confident Level"],
      datasets: [
        {
          data: [this.state.eyeBlink , this.state.distraction, this.state.confidence],
          backgroundColor: [
            "#F7464A",
            "#949FB1",
            "#4D5360",
            "#AC64AD"
          ],
          hoverBackgroundColor: [
            "#FF5A5E",
            "#A8B3C5",
            "#616774",
            "#DA92DB"
          ]
        }
      ]
    }
    this.setState({dataPie : pie})
  }

  render() {

    const handleGetResult = () => {
      var date = new Date();
      let id = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
      Services.getFaceDetectionData(id).then((res) => {
        let result = res.data;
        if(result){
          const faceinfo = result.faceInfo.M;
          this.setState({eyeBlink : faceinfo.eyeBlink.N})
          this.setState({distraction : faceinfo.distraction.N})
          this.setState({confidence : faceinfo.confidence.N})
        }
        console.log(result);
      });
      };
    return (
      <div>
        <Button onClick={handleGetResult} variant="success" >Result</Button>
            <div class="row w-100">
                <div class="col-md-3">
                    <div class="card border-info mx-sm-1 p-3">
                        <div class="text-info text-center mt-3"><h4>Eye Rest Level</h4></div>
                        <div class="text-info text-center mt-2"><h1>{this.state.eyeBlink}</h1></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-danger mx-sm-1 p-3">
                        <div class="text-danger text-center mt-3"><h4>Distraction Level</h4></div>
                        <div class="text-danger text-center mt-2"><h1>{this.state.distraction}</h1></div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-warning mx-sm-1 p-3">
                        <div class="text-warning text-center mt-3"><h4>Confident Level</h4></div>
                        <div class="text-warning text-center mt-2"><h1>{this.state.confidence}</h1></div>
                    </div>
                </div>
            </div>
      <MDBContainer>
        <h3 className="mt-5">Report</h3>
        <Pie data={{
      labels: ["Eye Rest Level", "Distraction Level", "Confident Level"],
      datasets: [
        {
          data: [this.state.eyeBlink , this.state.distraction, this.state.confidence],
          backgroundColor: [
            "#F7464A",
            "#949FB1",
            "#4D5360",
            "#AC64AD"
          ],
          hoverBackgroundColor: [
            "#FF5A5E",
            "#A8B3C5",
            "#616774",
            "#DA92DB"
          ]
        }
      ]
    }} options={{ responsive: true }} />
      </MDBContainer>
      </div>
    );
  }
}

export default ChartsPage;