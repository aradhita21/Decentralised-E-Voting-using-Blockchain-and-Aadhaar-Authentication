
const express = require('express')
const app = express()
var morgan = require('morgan');
const port = 3000
const bodyParser = require('body-parser');
var passwordHash = require('password-hash');
var cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
var request = require('request');
var hashResult ;

app.use( bodyParser.json() )
app.use(cookieParser());
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true })); 
const SHA256 = require("crypto-js/sha256");

/**
Vote class with Constructor 
votes associaated with candidates as Person
 **/
class Vote{
    constructor(voteOne, voteTwo, voteThree, voteFour){
        this.personOne = voteOne;
        this.personTwo = voteTwo;
        this.personThree = voteThree;
        this.personFour = voteFour;
    }
}

/**
 *
Block class contains element of Block
@param timestamp
@param votes
@param previousHash 
@param nonce =0
 */
class Block {
    constructor(timestamp, votes, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.votes = votes;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    /**
     *
     calculateHash of Block
     * @returns { Hash of @param previousHash +
                        @param timestamp+ 
                        @param votes}
                        @param nonce
     */
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.votes) + this.nonce).toString();
    }

    /**
     *
     mine Block increase difficulty for every Block 
     * @param difficulty
     */
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
       hashResult = "BLOCK MINED: " + this.hash + '\n';
        // console.log("BLOCK MINED: " + this.hash);
    }
}

/**
 *
 Blcochain Class 
 */
class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        this.pendingVotes = [];
    }

    /**
     *
     * @returns {Block}
     */
    createGenesisBlock() {
        return new Block(Date.parse("2021-05-02"), [], "0");
    }

    /**
     *
     * @returns {Last Block }
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     *
     mine Block of Chain Voting to calculate number of Voting for every candidate Person
          and Increase difficulty
     */
    minePendingVotes(){
        let block = new Block(Date.now(), this.pendingVotes, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        hashResult += 'Block successfully mined!'+'\r';
        // console.log('Block successfully mined!');
        this.chain.push(block);

    }

    /**
     *
     * @param vote
     */
    createVote(vote){
        this.pendingVotes = [];

        this.pendingVotes.push(vote);
    }

    /**
     *
     * @returns {number[Voting]}
     */
    getVotesCount(){
        
     let votesCount = [0, 0, 0, 0];

        for(const block of this.chain){
            for(const vote of block.votes){
                if(vote.personOne === 1){
                    votesCount[0]++; 
                }

                if(vote.personTwo === 1){
                    votesCount[1]++;
                }

                if(vote.personThree === 1){
                    votesCount[2]++;
                }
                if(vote.personFour === 1){
                    votesCount[3]++;
                }
            }
        }
        var a,b,c,d ;
        hashResult += "Voting Counter:\n" ; 
          hashResult +="Person One has "+ votesCount[0]+" Votes \n"  ; 
          hashResult += "Person Two has "+votesCount[1]+" Votes \n" ; 
           hashResult +="Person Three has "+votesCount[2]+" Votes \n"  ;
           hashResult +="Person Four has "+votesCount[3]+" Votes \n"  ;
        a = votesCount[0];
        b = votesCount[1];
        c = votesCount[2];
        d = votesCount[3];
           // console.log("Voting Counter:\n");
        // console.log("Person One has ",votesCount[0]," Votes");
        // console.log("Person Two has ",votesCount[1]," Votes");
        // console.log("Person Three has ",votesCount[2]," Votes");
        return votesCount;
    }

    /**
     *
     * @returns {boolean Valid}
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }

    /**
     *
     */
    traceChain(){

        for (let i = 0; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            hashResult += JSON.stringify(currentBlock, undefined, 2) ;
            // console.log(JSON.stringify(currentBlock, undefined, 2));
        }

    }
}

/**
 *
 * @type {Blockchain}
 */
let myVoteSystem = new Blockchain();
/**
 *
 */

//console.log('\n Starting the miner...');


app.use(express.static(path.join(__dirname, 'public')));

var username;
var password;

app.post('/login', function(req, res) {
    
	console.log(req.body);
    username = req.body.username;
    password = req.body.password;
    var hashedPassword = passwordHash.generate(password);
    console.log(hashedPassword);
    
    if (username == "admin" && password == "password") {

    	res.status(200).send({ message: hashedPassword});
        res.sendFile(path.join(__dirname, 'public', 'app.html'));
    } else {
    	res.status(500).send({ message: 'error' });
    }
});
app.post('/auth', function(req, res) {
	var cookie_pass = req.cookies['auth'];
	if (passwordHash.verify('password', cookie_pass)) {
		res.status(200).send({ message: hashedPassword});
	} else {
		res.status(500).send({ message: 'error' });
	}
});

app.get('/',function(req,res){
	var cookie_pass = req.cookies['auth'];
	if (passwordHash.verify('password', cookie_pass)) {	
        res.sendFile(path.join(__dirname, 'public', 'app.html'));
	} else {
        res.redirect('/app')
		console.log("okay");
	}
});

app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'app.html'));

})

app.get('/app', function(req, res){
	var cookie_pass = req.cookies['auth'];
	var cookie_otp = req.cookies['show'];

	if (passwordHash.verify('password', cookie_pass) && cookie_otp != null) {
		//res.sendFile(path.join(__dirname, 'ui', 'clist.html'));
		res.redirect('/info');
		

	} else if (cookie_otp == null && passwordHash.verify('password', cookie_pass)) {
		res.sendFile(path.join(__dirname, 'public', 'app.html'));
	}
	else {
		res.redirect('/');
	}	
});

app.get('/info', function(req, res){
	var cookie_pass = req.cookies['auth'];
	var cookie_otp = req.cookies['show'];
	if (cookie_pass == null || cookie_pass == '' || cookie_otp == null || cookie_otp == '') {
		console.log("redirect to app")
        res.redirect('/app');
	} else {
        res.sendFile(path.join(__dirname+ '/public','vote.html'));
    };
    })

app.post('/info', (req, res) => {
    var v1,v2,v3,v4;
    if(req.body.Person1 == 1){
        v1 = 1;
    }else{
        v1 =0;
    }
    if(req.body.Person2 == 1){
        v2 = 1;
    }else{
        v2 =0;
    }
    if(req.body.Person3 == 1){
        v3 = 1;
    }else{
        v3 =0;
    }
    if(req.body.Person4 == 1){
        v4 = 1;
    }else{
        v4 =0;
    }
    myVoteSystem.createVote(new Vote(v1, v2, v3, v4));

    myVoteSystem.minePendingVotes();

      myVoteSystem.getVotesCount();

      hashResult += "\nBlockchain:\n ";
      // console.log('\nBlockchain:\n');
     myVoteSystem.traceChain();

   res.redirect('/login');
});
app.get('/result',function(req,res) {
 res.send( hashResult);
 res.send(a,b,c,d)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
 console.log('Result page at : http://localhost:3000/result');



/**
 *
 */
