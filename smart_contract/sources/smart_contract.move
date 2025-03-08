module token_converter::smart_contract {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self};
    use sui::sui::SUI;
    use sui::event;
    
    // Error codes
    const EInsufficientBalance: u64 = 0;
    const EInvalidExchangeRate: u64 = 1;
    const EInvalidAmount: u64 = 2;
    
    // Events
    struct ConversionEvent has copy, drop {
        sender: address,
        token_amount: u64,
        naira_amount: u64,
        exchange_rate: u64,
        timestamp: u64,
    }
    
    // Exchange rate oracle (in a real implementation, this would fetch from an external source)
    struct ExchangeRateOracle has key {
        id: UID,
        // Exchange rate stored as tokens per NGN * 10^9 (to handle decimals)
        // For example, if 1 SUI = 1500 NGN, the rate would be 1_500_000_000_000
        sui_to_ngn_rate: u64,
        last_updated: u64,
        admin: address
    }
    
    // Initialize the module
    fun init(ctx: &mut TxContext) {
        let oracle = ExchangeRateOracle {
            id: object::new(ctx),
            // Initial rate (this would be updated regularly in production)
            sui_to_ngn_rate: 1_500_000_000_000, // Example: 1 SUI = 1500 NGN
            last_updated: tx_context::epoch(ctx),
            admin: tx_context::sender(ctx)
        };
        
        transfer::share_object(oracle);
    }
    
    // Update the exchange rate (only callable by admin)
    public entry fun update_exchange_rate(
        oracle: &mut ExchangeRateOracle,
        new_rate: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == oracle.admin, 0);
        assert!(new_rate > 0, EInvalidExchangeRate);
        
        oracle.sui_to_ngn_rate = new_rate;
        oracle.last_updated = tx_context::epoch(ctx);
    }
    
    // Convert SUI to NGN (virtual conversion, doesn't actually mint Naira tokens)
    public entry fun convert_to_naira(
        oracle: &ExchangeRateOracle,
        sui_coin: &mut Coin<SUI>,
        amount: u64,
        ctx: &mut TxContext
    ): u64 {
        assert!(amount > 0, EInvalidAmount);
        assert!(coin::value(sui_coin) >= amount, EInsufficientBalance);
        
        // Calculate NGN amount based on exchange rate
        // The rate is tokens per NGN * 10^9, so we multiply and divide accordingly
        let naira_amount = (amount * oracle.sui_to_ngn_rate) / 1_000_000_000;
        
        // Emit conversion event
        event::emit(ConversionEvent {
            sender: tx_context::sender(ctx),
            token_amount: amount,
            naira_amount,
            exchange_rate: oracle.sui_to_ngn_rate,
            timestamp: tx_context::epoch(ctx),
        });
        
        naira_amount
    }
    
    // Actually convert SUI to NGN by taking the SUI and returning the calculated NGN amount
    public entry fun exchange_sui_for_naira(
        oracle: &ExchangeRateOracle,
        sui_coin: &mut Coin<SUI>,
        amount: u64,
        _recipient_address: address,
        ctx: &mut TxContext
    ) {
        assert!(amount > 0, EInvalidAmount);
        assert!(coin::value(sui_coin) >= amount, EInsufficientBalance);
        
        // Take the SUI from the user
        let sui_balance = coin::balance_mut(sui_coin);
        let taken_sui = balance::split(sui_balance, amount);
        let payment = coin::from_balance(taken_sui, ctx);
        
        // Calculate NGN amount
        let naira_amount = (amount * oracle.sui_to_ngn_rate) / 1_000_000_000;
        
        // Transfer the SUI to the contract admin (could be a treasury in a real implementation)
        transfer::public_transfer(payment, oracle.admin);
        
        // Emit conversion event
        event::emit(ConversionEvent {
            sender: tx_context::sender(ctx),
            token_amount: amount,
            naira_amount,
            exchange_rate: oracle.sui_to_ngn_rate,
            timestamp: tx_context::epoch(ctx),
        });
        
        // Note: In a real-world scenario, this would trigger an off-chain process
        // to send Naira to the user through a payment provider or bank transfer
    }
    
    // Get current exchange rate
    public fun get_exchange_rate(oracle: &ExchangeRateOracle): u64 {
        oracle.sui_to_ngn_rate
    }
    
    // Get last updated time
    public fun get_last_updated(oracle: &ExchangeRateOracle): u64 {
        oracle.last_updated
    }
}