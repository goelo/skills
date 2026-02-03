---
name: Kaspa Wallet
description: |
  Self-contained Kaspa wallet CLI skill (no preconfigured MCP server required).
  Use when user wants to:
  - Check KAS balance for an address
  - Inspect node/server info
  - Send KAS using a mnemonic/private key provided via environment variables
  - Generate payment request URIs
metadata:
  slug: kaspa-wallet
  display_name: Kaspa Wallet
---

# Kaspa Wallet (Self-contained)

This skill is designed to “just work” after running a local installer. It does **not** require the user to pre-install/configure an MCP server.

The agent interacts with Kaspa by running a local CLI:

- `./kaswallet.sh balance ...`
- `./kaswallet.sh node-info ...`
- `./kaswallet.sh send ...`

## Install (one-time)

Run:
- `bash install.sh`

This creates a local virtualenv in `.venv/` and installs/updates Python deps (via `pip`).

## Configuration (env vars)

These env vars are read by `kaswallet.sh`:

- `KASPA_RPC_URL` (optional): wRPC endpoint (WebSocket URL). If unset, the client will try public node discovery (PNN) if supported by the installed SDK, otherwise it will fail with a clear message.
- `KASPA_NETWORK` (optional): `mainnet` (default) or `testnet-10` / `devnet`.

Wallet secrets (recommended to set in the runtime, not in chat):

- `KASPA_MNEMONIC` (optional): Mnemonic seed phrase (12–24 words).
- `KASPA_PRIVATE_KEY` (optional): Private key hex (single-key wallet).

Timeouts:

- `KASPA_CONNECT_TIMEOUT_MS` (optional, default 60000)
- `KASPA_REQUEST_TIMEOUT_MS` (optional, default 60000)

## Safety rules (must follow)

- Never print `KASPA_MNEMONIC` / `KASPA_PRIVATE_KEY` contents.
- Before **any** send, do a preflight (balance + fee estimate if available) and show a summary.
- Require explicit user confirmation before sending (or require `--yes` flag).

## Common workflows

### Check balance

Run:
- `./kaswallet.sh balance --address kaspa:...`

### Node / server info

Run:
- `./kaswallet.sh node-info`

### Send KAS (recommended flow)

1) Preflight (no broadcast):
- `./kaswallet.sh send --to kaspa:... --amount 0.9 --dry-run`

2) Ask user to confirm the exact `to`, `amount`, and fees, then broadcast:
- `./kaswallet.sh send --to kaspa:... --amount 0.9 --yes`

### Payment URI

Run:
- `./kaswallet.sh payment-uri --address kaspa:... --amount 1.23 --message "..." --label "..."`

