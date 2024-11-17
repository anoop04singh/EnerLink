EnerLink - Decentralized Energy Grid
====================================

**Contract Address**: `0xdb0538df56fa2a4e262fccf4d0c6a4a0aa4c9ed713d1b3b3280dbeb12becf29a`\
[View Pitch Deck](https://www.canva.com/design/DAGVJcYX5MM/hx1je2wHqaqpCh6-3sVnRA/view?utm_content=DAGVJcYX5MM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h31e56aab16)

Project Overview
----------------

EnerLink is a decentralized platform on the Aptos blockchain that aims to enable peer-to-peer energy trading, incentivize green energy production, and promote sustainable energy use. The platform tokenizes energy generated from IoT-enabled smart meters into tradeable and burnable tokens, creating a flexible and decentralized energy market. By putting energy data onto the blockchain, EnerLink demonstrates a sustainable model for decentralized energy production and consumption.

Basic Visualization of the Ecosystem
------------------------------------

![flowChartEnerlink](https://github.com/user-attachments/assets/a4e01690-6d43-414d-8288-92d8f540809f)


This initial version of EnerLink offers a foundational prototype for a decentralized energy grid. The current system simulates energy generation and utilization through tokenized credits, which can be minted and burned based on energy data.

For demonstration purposes, the generated tokens are stored in a wallet, where they can be:

-   **Traded**: Users can exchange energy tokens with others in the ecosystem.
-   **Burned**: When energy is utilized, tokens are burned, representing energy consumption.

We have developed a simple smart contract on the Aptos devnet that manages these token actions, illustrating the concept of tokenizing energy. While a fully integrated IoT system is not yet implemented, this prototype gives a visual understanding of how decentralized energy exchange and smart meter integration would work in the future.

Future Vision and Scope
-----------------------

### Expanding the Ecosystem

The next phases of EnerLink envision an extensive, interconnected ecosystem that brings true decentralization and sustainability to energy markets. Future improvements will include:

-   **Smart Meter Connectivity**: Direct integration with IoT-enabled smart meters to capture real-time energy production and consumption data.
-   **Real-Time Energy Data**: Automated transactions based on live energy usage and generation data, strengthening the link between energy produced and tokens minted.
-   **Energy Token Marketplace**: A platform for seamless buying, selling, and trading of energy credits to build an independent and fair energy economy.
-   **Carbon Footprint Reduction**: Support for green energy producers to incentivize renewable energy sources and contribute to sustainability goals.

These enhancements will transform EnerLink into a real-world, autonomous energy grid that rewards green energy and empowers users through decentralized ownership and transparent energy trading.

### Sustainability and Decentralization

EnerLink's framework emphasizes:

-   **Sustainable Energy Use**: Encouraging renewable energy sources, which aligns with a vision for a carbon-neutral future.
-   **Decentralization**: EnerLink removes central authority and gives control back to energy producers and consumers, fostering peer-to-peer energy trading.
-   **Empowering Green Energy Producers**: By providing incentives for renewable energy, EnerLink promotes the use of sustainable resources.

Through smart contract automation, users can easily mint, burn, and trade energy tokens, leading to a self-sustaining and sustainable energy ecosystem.

Smart Contract Snippets
-----------------------

Below are snippets from the EnerLink smart contract, written in Move on the Aptos blockchain, demonstrating key functionalities:

### Minting Energy Tokens

This function mints tokens as energy is generated, simulating renewable energy production.

`public fun mint_energy_tokens(account: &signer, amount: u64) {
    // Function logic to mint tokens
}`

### Burning Tokens Upon Consumption

Tokens are burned as energy is consumed, representing a reduction in available energy credits.


`public fun burn_energy_tokens(account: &signer, amount: u64) {
    // Function logic to burn tokens
}`
