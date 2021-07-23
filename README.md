# 
Decentralised-E-Voting-with-Blockchain with Aadhaar authentication

Aim : 
Electronic voting is often seen as a tool for making the electoral process more efficient and for increasing trust in its
management. Using blockchain technology, voting process can be made more secure, transparent, immutable, and reliable.

Description : 
This project is an E-Voting System with blockchain technology. The following are the parts that are involved in the system’s infrastructure design.

	Decentralized system  
	Blockchain 
	Aadhaar for authentication 
	
  	
----------------------------------------

This project explores the potential of blockchain technology and its usefulness in the e-voting scheme. The blockchain will be publicly verifiable and decentralised in a way that no one will be able to corrupt it.


Output : 
	
	voting page : 
	http://localhost:3000/
	
	Result of voting Page : 
	http://localhost:3000/result
  	
----------------------------------------


How to run : 

	Add aadhaar and phone number in Public/js/app.js
	Add aadhaar name in Public/js/index.js
	There is no need to run ethereum, this is self built blockchain.
	
	npm install
	npm start or node BlockChainVoting.js
	
	
  	Open voting page http://localhost:3000/
	Add user credentials (admin and password)
	
	Then page is redirected to the voters login page, voters have to enter their aadhaar number, and they will receive an OTP on the phone number linked with their Aadhaar. 
	Then voter is authenticated and redirected to the voting page, where he can select any candidate and on pressing submit, vote is casted and stored in a block which is chained in the blockchain. 
	The page is redirected again to the voters login page, where another voter can authenticate herself.
	
	To see the results, open http://localhost:3000/result
	
	
----------------------------------------
