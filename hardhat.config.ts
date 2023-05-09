import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { config as dotEnvConfg } from 'dotenv';
dotEnvConfg();

const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  networks: {
    local: {
      url: 'http://127.0.0.1:8545',
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
