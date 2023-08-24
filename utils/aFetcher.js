import axios from "axios";

const a_fetcher = (url) => axios.get(url).then((res) => res.data);

export default a_fetcher;
