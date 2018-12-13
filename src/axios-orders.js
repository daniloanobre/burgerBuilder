import axios from "axios";

const instance = axios.create({
  baseURL: "https://burgerbuilder-ebdb9.firebaseio.com/"
});

export default instance;
