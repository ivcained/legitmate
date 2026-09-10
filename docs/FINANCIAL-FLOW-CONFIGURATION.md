# Financial flow configuration

Privy Financial Flows provide deposits, payouts, onramp, swaps, cards, and other money movement primitives. LegitMate currently records the configuration for the planned testnet flow but keeps execution disabled until the recipient wallet and Privy policy are configured.

## Applied Base Sepolia defaults

```env
FINANCIAL_FLOW_MODE=disabled
FINANCIAL_CHAIN_ID=84532
FINANCIAL_CHAIN_NAME=Base Sepolia
FINANCIAL_CHAIN_CAIP2=eip155:84532
FINANCIAL_RPC_URL=https://sepolia.base.org
FINANCIAL_CONFIRMATIONS_REQUIRED=2
FINANCIAL_TOKEN_SYMBOL=ETH
FINANCIAL_TOKEN_CONTRACT=
FINANCIAL_TOKEN_DECIMALS=18
FINANCIAL_RECIPIENT_ID=legitmate-testnet-treasury
FINANCIAL_RECIPIENT_ADDRESS=
PRIVY_POLICY_ID=
PRIVY_WALLET_ID=
```

`FINANCIAL_FLOW_MODE=disabled` is intentional. The application must not send funds until these are set and server-side authentication, policy evaluation, ownership, intent persistence, idempotency, receipt verification, and reconciliation are implemented.

## Required before enabling a test flow

- A fixed Base Sepolia recipient address.
- The Privy wallet ID used for the flow.
- The Privy policy ID and approved limits.
- A selected flow: embedded-wallet user-signed transfer or organization/treasury wallet approval.
- Testnet gas funding.
- A persisted payment-intent record and receipt verification.

Do not use a client-supplied recipient, token, chain, policy, or amount as the authorization source.
