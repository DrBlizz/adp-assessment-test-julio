interface ITransaction {
  transactionID: string,
  timeStamp: string,
  amount: number,
  type: string,
  location: {
    name: string,
    country: string,
    city: string,
    state: string,
    id: string,
    marketCode: number
  },
  employee: {
    name: string,
    id: string,
    categoryCode: string,
    location: {
      primaryWorkLocation: boolean,
      id: string
    }
  }
};

export default interface ITransactions {
  id: string,
  transactions:[ITransaction];
};
