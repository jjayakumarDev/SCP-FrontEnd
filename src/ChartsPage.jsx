import React from "react";
import { Pie } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {Alert, Button} from 'react-bootstrap';
import Services from "./services";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class ChartsPage extends React.Component {
  state = {
    eyeBlink : '0',
    distraction : '0',
    confidence : '1',
    startDate : new Date(),
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
    //const [startDate, setStartDate] = useState(new Date());
    const handleGetResult = () => {
      var date = new Date();
      let id = ""+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+"";
      if(this.state.startDate){
        id = (this.state.startDate.getMonth()+1)+"/"+this.state.startDate.getDate()+"/"+this.state.startDate.getFullYear();
        console.log(id)
      }
      
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

      const getAllFaceResults = () => {
        Services.getAllResults().then((res) => {
          var items = res.data;
          console.log(items)
          var length = items.length;
          let eyeInfoValue = 0;
            let distractionValue = 0;
            let confideneceValue = 0;
          for (var i = 0; i < length; i++) {
            const faceinfo = items[i].faceInfo.M;
            eyeInfoValue = parseInt(faceinfo.eyeBlink.N) + eyeInfoValue;
            distractionValue = parseInt(faceinfo.distraction.N) + distractionValue;
            confideneceValue = parseInt(faceinfo.confidence.N) + confideneceValue;
          } 
          eyeInfoValue = eyeInfoValue/length;
          distractionValue = distractionValue/length;
          confideneceValue = confideneceValue/length;
          this.setState({eyeBlink : eyeInfoValue})
          this.setState({distraction : distractionValue})
          this.setState({confidence : confideneceValue})
          console.log(eyeInfoValue+" "+distractionValue+" "+confideneceValue)
        });
      };

    return (
      <div>
        <div class="container">
          <div class="row">
          <div class="container">
            <div class="row">
            <div class="col-sm">
            <DatePicker selected={this.state.startDate} onChange={date => this.setState({startDate : date})} />
              </div>
              <div class="col-sm">
              <button class="btn btn-lg btn-block btn-outline-primary" onClick={handleGetResult}>Result</button>
              </div>
              <div class="col-sm">
              <button class="btn btn-lg btn-block btn-outline-primary" onClick={getAllFaceResults} >Overall Result</button>
              </div>
            </div>
          </div>
          </div>
        </div>
        <br></br>

        <div class="card-deck mb-3 text-center">
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Eye Rest Level</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">{this.state.eyeBlink}</h1>
          </div>
        </div>
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Distraction Level</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">{this.state.distraction}</h1>
          </div>
        </div>
        <div class="card mb-4 box-shadow">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Confident Level</h4>
          </div>
          <div class="card-body">
            <h1 class="card-title pricing-card-title">{this.state.confidence}</h1>
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