import React, { useEffect, useMemo, useState } from 'react';


interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

const useWalletBalances = () => {
  const [balances, setBalances] = useState(null);

  useEffect(() => {

    setTimeout(() => {
      setBalances([]); 
    }, 1000); 
  }, []);

  return balances;
};

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

class Datasource {
  constructor(private url: string) {}

  async getPrices(): Promise<any> {
    try {
      const response = await fetch(this.url);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const prices = await response.json();
      return prices;
    } catch (error) {
      throw new Error(`Failed to fetch prices: ${error.message}`);
    }
  }
}

interface BoxProps {
  children?: React.ReactNode;
}

interface WalletRowProps {
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

const WalletRow: React.FC<WalletRowProps> = ({
  amount,
  usdValue,
  formattedAmount,
}) => {
  return (
    <div className="wallet-row">
      <div className="wallet-cell">{formattedAmount}</div>
      <div className="wallet-cell">{amount}</div>
      <div className="wallet-cell">{usdValue}</div>
    </div>
  );
};

const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datasource = new Datasource("https://interview.switcheo.com/prices.json");
        const fetchedPrices = await datasource.getPrices();
        setPrices(fetchedPrices);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      ? balances
          .filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            return balancePriority > -99 && balance.amount <= 0;
          })
          .sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            return rightPriority - leftPriority;
          })
      : [];
  }, [balances]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};


