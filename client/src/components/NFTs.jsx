import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

const NFTCard = ({ title, image , url }) => {
    return (
        <div className="bg-[#181918] m-4 flex flex-1
            2xl:min-w-[400px]
            2xl:max-w-[500px]
            sm:min-w-[270px]
            sm:max-w-[300px]
            flex-col p-3 rounded-md hover:shadow-2xl
        ">
            <div className="flex flex-col items-center w-full mt-3">
                <img
                    src={image}
                    alt="image"
                    className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
                />


                <a href={url} target="_blank" className='text-[#fff] font-blod rounded-md -mt-2'><span>{title}</span></a>

            </div>
            
        </div>
    );
}

const NFTs = () => {

    const { currentAccount, NFTs } = useContext(TransactionContext);
    return (
        <div className="flex w-full justify-center items-center 2xl:px-20">
            <div className="flex flex-col md:p-12 py-12 px-4">
                {currentAccount ? (
                    <h3 className="text-white text-3xl text-center my-2"> Your NFTs</h3>
                ) : (
                    <h3 className="text-white text-3xl text-center my-2"> connect your account to see your NFTs</h3>
                )}

                <div className="flex flex-wrap justify-center items-center mt-10">
                    {NFTs.map((NFT, i) => (
                        <NFTCard key={i} {...NFT} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NFTs;