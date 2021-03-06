import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

import { alchemyAPI_KEY } from "../utils/alchemy";
import { OpenSeaKey } from "../utils/opensea";


export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState("")
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);
    const [NFTs, setNFTs] = useState([]);

    //https://sebhastian.com/handlechange-react/
    const handleChange = (event, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: event.target.value }));
    }

    const getAllTransactions = async () => {
        try {
            if (!ethereum) return alert("You need install metamask first");

            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();
            const structureTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18),
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString()
            }))

            console.log(structureTransactions);
            setTransactions(structureTransactions);


        } catch (error) {
            console.log(error);
        }
    }

    const getNFTs = async (account) => {

        try {

            //??????????????????NFT
            const options = {
                method: 'GET',
                headers: {Accept: 'application/json', 'X-API-KEY': `${OpenSeaKey}`}
              };

            const response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${account}`,options);
            const jsonData = await response.json();
            const NFTData = jsonData.assets;

            const formatNFTs = NFTData.map((NFT) => ({
                title: NFT.name,
                image: NFT.image_url,
                url: NFT.permalink
            }))

            console.log(formatNFTs);
            console.log(formatNFTs.sort());
            setNFTs(formatNFTs.sort());

        } catch (error) {
            console.log(error);
        }

    }

    const checkIfWalletIsConnected = async () => {

        try {

            if (!ethereum) return alert("You need install metamask first");

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                getAllTransactions();

                getNFTs(accounts[0]);
            } else {
                console.log("No accounts found");
            }

        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }

    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount);


        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("You need install metamask first");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert("You need install metamask first");

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);


            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: formData.addressTo,
                    gas: '0x5208', //16?????? 21000 Gwei
                    value: parsedAmount._hex, //????????????????????????16??????
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());

        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    useEffect(() => {
        //??????????????????????????????????????????
        checkIfWalletIsConnected();
        //????????????????????????????????????
        checkIfTransactionsExist();
    }, []);

    return (
        //???TransationProvider?????????state,fuction????????????????????????component
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, sendTransaction, isLoading, transactions, NFTs }}>
            {children}
        </TransactionContext.Provider>
    )
}
