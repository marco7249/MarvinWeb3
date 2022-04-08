import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';


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
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    //https://sebhastian.com/handlechange-react/
    const handleChange = (event, name) => {
        setFormData((prevState) => ({...prevState,[name]: event.target.value }));
    }

    const checkIfWalletIsConnected = async () => {

        try {

            if (!ethereum) return alert("You need install metamask first");

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                //getAllTransactions();
            } else {
                console.log("No accounts found");
            }

            console.log(accounts);

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

            const {addressTo, amount, keyword, message} = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);


            await ethereum.request({
                method:'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: formData.addressTo,
                    gas: '0x5208', //16進位 21000 Gwei
                    value: parsedAmount._hex, //將轉移金額轉換成16進位
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

        } catch(error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    useEffect(() => {
        //一進網頁先檢查錢包是否有連線
        checkIfWalletIsConnected();
    }, []);

    return (
        //將TransationProvider裡面的state,fuction直接提供給需要的component
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, sendTransaction, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}
