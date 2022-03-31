require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      //url comes from https://dashboard.alchemyapi.io/apps/u3aqvsozdh19xlio 
      url: 'https://eth-ropsten.alchemyapi.io/v2/9UbN5TyEAiAk1QrdRpHpIn-M2ozgJbFQ',
      accounts: ['4c32b311eaaae3bf67334374eb1b642aa079f01894d1eedb57148307e39e46ae']
    }
  }
  
}