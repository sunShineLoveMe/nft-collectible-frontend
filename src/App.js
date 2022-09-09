import { useEffect, useState } from 'react';
import './App.css';
import contract from "./contracts/NFTCollectible.json";
import { ethers } from 'ethers';

const contractAddress = "0xb29853A8d4fD0Ba11B47fD3d6199753A635aa3eF";
const abi = contract.abi;


function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("make sure you have Metamask installed!");
      return;
    } else {
      console.log("wallet exists! we are ready to go!");
    }
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("发现授权账户: " + account);
      setCurrentAccount(account);
    } else {
      console.log("没有发现授权账户");
    }

  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert(" 请安装metaMask钱包! ");
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("第一个账户信息:" + accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") });

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>Scrappy Squirrels Tutorial</h1>
      <div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;
