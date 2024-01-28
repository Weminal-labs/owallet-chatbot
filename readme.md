# OWallet

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/oraichain/owallet/blob/master/LICENSE.txt)
[![Twitter: OWallet](https://img.shields.io/twitter/follow/oraichain.svg?style=social)](https://twitter.com/oraichain)

<img width="761" alt="image" src="https://github.com/hien-p/owallet-chatbot/assets/70145901/1294587c-8121-48e0-8999-6ffb411a5c07">


## OWallet x Weminal AI  
OWallet is the gateway to Oraichain ecosystem and aims to be the universal gateway to Cosmos networks and other Web3 dApps. Users can create an account to hold and securely manage their assets on Mainnet.

# But What if OWallet were directly linked to a large language model?

![image](https://github.com/hien-p/owallet-chatbot/assets/70145901/4b5237e9-554c-4be3-835d-e38c352870a2)

Meet Weminal-public, an all-in-one chat bot from Chrome extension to your browser. With an integration of Weminal, the cryptocurrency experience could be taken to the next level. This enable to access to Weminal's services right within the Owallet interface. Users could have access to crypto assistance from their wallet. They wouldn't need to browse away to find answers. 


Users would simply type in requests, such as "What's the difference between EVM and Oraichain?" or "How do I add a token to my portfolio?". The bot would then display results instantly, drawing from its wealth of easy-to-understand educational resources. This makes learning the basics of the crypto space much more convenient.

For more complex tasks, the Weminal bot on Chrome extension could help execute transactions and trades directly through OWallet. For example, we have use "Cross-swap" function from contract Oraidex to swap assets with just a few messages. This streamlines moving assets securely.

We aim to provide a solution that enables AI to interact with Oraichain Ecosystem. This will create a new world where web2 users, builders, and experienced individuals can easily  gives users the ability to make better decisions on decentralized finance.


## weminal’s key features
![image](https://github.com/hien-p/owallet-chatbot/assets/70145901/98025cb4-eb80-429c-a956-e450aa660c5b)


## Technical inquiries
- OWallet source code: https://github.com/oraichain/owallet
- OWallet website: https://owallet.dev
- Discord https://discord.gg/JNyFnU789b

## Install
1. Git clone this repo to desired directory

```shell
git clone https://github.com/oraichain/owallet
```

2. Clone packages/background
    
    2.1. Delete packages/background
    
    2.2. Then execute folowing commands in terminal:
    ```shell
    git submodule add --force https://github.com/oraichain/owallet-background.git packages/background

    cd packages/background

    git checkout -b develop remotes/origin/develop
    ```

3. Install required packages
    
    3.1. Open package.json and modify version of **lerna**
    ```
    "lerna": "^6.6.2"
    ```
    
    3.2. Open lerna.json and add this line
    ```
    "useWorkspaces": true
    ```
    
    3.3. Run the below command
    ```shell
    yarn
    yarn bootstrap
    ```

4. Build it
    `yarn build`
    
    When building for the first time, you may encouter the error. Do not worry, try to run `yarn build` again.
    
    And for the last package @owallet/extension, you should go directly into that package then `yarn build`
