module 0xdb0538df56fa2a4e262fccf4d0c6a4a0aa4c9ed713d1b3b3280dbeb12becf29a::energy_token {
    use aptos_framework::coin;

    struct EnergyToken {}

    fun init_module(sender: &signer) {
        aptos_framework::managed_coin::initialize<EnergyToken>(
            sender,
            b"EnergyToken",
            b"ENER",
            6,
            false,
        );
    }

    public entry fun register(account: &signer) {
        aptos_framework::managed_coin::register<EnergyToken>(account)
    }

    public entry fun mint(account: &signer, dst_addr: address, amount: u64) {
        aptos_framework::managed_coin::mint<EnergyToken>(account, dst_addr, amount);
    }

    public entry fun burn(account: &signer, amount: u64) {
        aptos_framework::managed_coin::burn<EnergyToken>(account, amount);
    }

    public entry fun transfer(from: &signer, to: address, amount: u64,) {
        coin::transfer<EnergyToken>(from, to, amount);
    }
}
