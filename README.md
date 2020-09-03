## A webapp that's built with React and Firebase

Aspera needed a platform where users can bid on a company for Corporate Wars.
Due to the social distancing practices, we couldn't hold an actual in person auction.
So I made this to sort of emulate that experience.

### How does it work?

First, it fetches data from Firestore when it's opened.
Then it asks the user to sign in, because we can hold the auction from one source of truth for each team.
Only the team leaders can bid in the auction.
The app uses localStorage and Firestore for storage.
Each bid round is 30 seconds long.
User will be allowed to bid once per round.
Data will be updated in real time.
Each user has a seed amount of 30C.
User will be allowed to bid upto that limit.

# Database structure

String: nameOfCompany, Number: bidCounts, Number: 9C + (25L x bidCounts), String: biddingParty, Boolean: isBiddable
