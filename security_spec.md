# Security Specification - Media App

## Data Invariants
1. **Admins**: Only users whose UIDs are present in the `/admins/` collection (or a hardcoded list for initial setup) can create, update, or delete media.
2. **Media (Movies/TV/etc)**:
   - Must have a unique `id`.
   - `createdAt` must be set to the server timestamp on creation and remain immutable.
   - `updatedAt` must be updated to the server timestamp on every update.
   - Public users can read all media documents.
   - Only admins can write to the `movies` collection.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Unauthenticated Write**: Trying to create a movie document without being signed in.
2. **Non-Admin Create**: Signed-in user (not in admins collection) trying to create a movie.
3. **Admin Identity Spoofing**: User trying to create a document in the `admins` collection to make themselves an admin.
4. **Invalid Schema (Missing Title)**: Admin trying to create a movie with no title.
5. **Invalid Schema (Type mismatch)**: Admin trying to set `year` as a number instead of a string.
6. **Immutable Field Violation**: Admin trying to change the `createdAt` timestamp of an existing movie.
7. **Future Timestamp**: Admin trying to set `updatedAt` to a future date instead of `request.time`.
8. **Malicious ID**: Admin trying to use a 2MB string as a document ID.
9. **Field Injection**: Admin trying to add a "Ghost Field" like `isVerifiedBySystem: true` that isn't in the schema.
10. **State Corruption**: Admin trying to set `rating` to "999/10".
11. **Orphaned Write**: Admin trying to update a movie that doesn't exist.
12. **PII Leak Attempt**: Unauthorized user trying to list the `admins` collection (if it contains PII).

## Security Strategy
- We will use a `split` strategy where `/movies` is public-read, admin-write.
- The `admins` collection will be used to verify admin status via `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`.
- For the very first admin, we can use the user's email: `chaosclancontact1@gmail.com`.
