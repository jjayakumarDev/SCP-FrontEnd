import axios from "axios";

//REST API End points
const FACE_RECOGNITION_API_URL =  "https://smibnu6avh.execute-api.us-east-1.amazonaws.com/default/face-recognition";

class AttentionMonitorServices {
    getFaceDetectionData() {
        return axios.get(FACE_RECOGNITION_API_URL);
    }
    postFaceDetectionData(body) {
        return axios.post(FACE_RECOGNITION_API_URL, body);
    }
}

export default new AttentionMonitorServices;