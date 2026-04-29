# Security Specification - Classical Cryptography App

## Data Invariants
1. A user document must have a UID matching the authenticated requester.
2. `lastLevelIndex` must be a non-negative integer.
3. Users cannot modify other users' data.

## The Dirty Dozen Payloads (Rejection Targets)
1. Creating a user document with a different PID than the authenticated user.
2. Updating `email` or `uid` field after creation (immutability).
3. Setting `lastLevelIndex` to a negative value.
4. Setting `lastLevelIndex` to a string instead of a number.
5. Deleting another user's document.
6. Reading a list of all users as a standard user.
7. Injecting a massive string into `displayName`.
8. Setting `completed` to true without a valid index.
9. Impersonating an admin (if admin features existed).
10. Creating a document without `email`.
11. Updating `createdAt` timestamp.
12. Creating a document with a future `createdAt`.

## Firestore Rules
I will now define the rules in `firestore.rules`.
