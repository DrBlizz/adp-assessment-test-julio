import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/v2",
  headers: {
    "Content-type": "application/json",
  },
});

const getTransactionsData = async () => {
  const response = await apiClient.get("/get-task");
  return response.data;
}

const ReceiveDataService = {
  getTransactionsData
}

export default ReceiveDataService;