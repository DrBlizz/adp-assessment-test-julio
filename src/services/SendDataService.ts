import axios from "axios";
import IEmployee from "../types/Employee";

const apiClient = axios.create({
  baseURL: "/api/v2",
  headers: {
    "Content-type": "application/json",
  },
});

const postTopEarner = async (employee: IEmployee, id: string) => {
	const result = employee.transactions;
  const response = await apiClient.post<any>("/submit-task", { id, result });
  return response.data;
}

const SendDataService = {
  postTopEarner
}

export default SendDataService;