export type Cw20ContractBalance = {
  balance: string;
};

export type Cw20ContractTokenInfo = {
  decimals: number;
  name: string;
  symbol: string;
  total_supply: string;
  token_info_response?: {
    decimals: number;
    name: string;
    symbol: string;
    total_supply: string;
  };
};
