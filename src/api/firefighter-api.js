import axios from "axios";

const firefighterAPI = axios.create({
  baseURL:'https://cors-anywhere.herokuapp.com/http://217.71.138.9:4569'
});

export default firefighterAPI;
