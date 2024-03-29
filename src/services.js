import axios from "axios";

//REST API End points
const FACE_RECOGNITION_API_URL =  "https://smibnu6avh.execute-api.us-east-1.amazonaws.com/dev/face-recognition";
const FACE_SCAN_API_URL = "https://dmo0kfk6w8.execute-api.us-east-1.amazonaws.com/dev/faceScan";
const GET_REPORT_API_URL = "https://2gn21eud6f.execute-api.us-east-1.amazonaws.com/dev/";

class AttentionMonitorServices {
    getFaceDetectionData(id) {
        return axios.get(FACE_RECOGNITION_API_URL+"?id="+id);
    }
    postFaceDetectionData(body) {
        return axios.post(FACE_RECOGNITION_API_URL, body);
    }
    getAllResults(){
        return axios.get(FACE_SCAN_API_URL);
    }
    getReport(){
        return axios.get(GET_REPORT_API_URL);
    }
}

export default new AttentionMonitorServices;