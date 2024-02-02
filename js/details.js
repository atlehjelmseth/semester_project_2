const api_base_url = 'https://api.noroff.dev';
const listingsUrl = `${api_base_url}/api/v1/auction/listings`
const loginUrl = `${api_base_url}/api/v1/auction/auth/login`
const listingDetails = document.querySelector(".listingdetails");
const listingSeller = document.querySelector(".sellerdetails");
const highestBid = document.querySelector(".highestbid");
const bidders = document.querySelector(".bidders");
const bidStatus = document.querySelector(".bidstatus");
const makeBidButton = document.querySelector(".makebidbutton");
const yourOwnListing = document.querySelector(".yourownlisting");
const statusMessage = document.querySelector(".error");
const totalBid = document.querySelector(".totalbid");
const biddingHistory = document.querySelector(".biddinghistory");
const bidButtonContainer = document.querySelector(".bidbuttoncontainer");;
const localEmail = localStorage.getItem('email');
const localName = localStorage.getItem('name');
const localCredit = localStorage.getItem('credits')
const token = localStorage.getItem('accessToken');
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
const specs = listingsUrl + "/" + id + "?_seller=true&_bids=true";
const listingsBid = listingsUrl + "/" + id + "/bids"


/* Bring up all the details on the listing */

async function listingSpecs() {
  try {const response = await fetch(specs);
       const resultsSpec = await response.json();
       const sellerName = resultsSpec.seller.name;
       const sellerEmail = resultsSpec.seller.email;
       const sellerAvatar = resultsSpec.seller.avatar;
      
       if (resultsSpec.title === "") {
        var title  = "No title";
      } else {
        var title  = resultsSpec.title;
      }
      if (resultsSpec.description === "" || resultsSpec.description === null) {
        var description  = "No description";
      } else {
        var description  = resultsSpec.description;
      }
      if (resultsSpec.media[0] === undefined) {
        var picture = "/img/error.png";
      } else {
        var picture = resultsSpec.media[0];
      }
       

       if (resultsSpec._count.bids === 0) {
        let currentBid = 0;
        let bidderName = "no one";
        var t = document.createTextNode("BID 10");
        makeBidButton.appendChild(t);
        listingDetails.innerHTML = "";

        listingDetails.innerHTML += `<div class="spectitle">
                                       <div class="picture_and_specs">
                                        <img onerror="this.src='/img/error.png' "src="${picture}" alt="Picture of ${title}"">
                                        <p>Title: ${title}</p>
                                      </div>
                                       <div>
                                       <p class="description">Description: ${description}</p>
                                       </div>
                                    </div>
        `;
        yourOwnListing.innerHTML = "";
        yourOwnListing.innerHTML += `<p>There are no current bids. Be the first!</p>`;
        biddingHistory.innerHTML = "";
       } else {
        let largest = 0;
        for(let i = 0; i < resultsSpec.bids.length; i++) {
         if (resultsSpec.bids[i].amount > largest) {
           largest = resultsSpec.bids[i].amount;
           largestName = resultsSpec.bids[i].bidderName;
         }
       }
        let currentBiggestBid = largest;
        let currestBiggestName = largestName;
        var t = document.createTextNode(`BID ${currentBiggestBid+10}`);
        makeBidButton.appendChild(t);
        listingDetails.innerHTML = "";
        listingDetails.innerHTML += `<div class="spectitle">
                                       <div class="picture_and_specs">
                                        <img onerror="this.src='/img/error.png' "src="${picture}" alt="Picture of ${title}"">
                                        <p class "title">Title: ${title}</p>
                                        </div>
                                        <div>
                                          <p class="description">Description: ${description}</p>
                                          <p>${currestBiggestName} has the largest bid of ${currentBiggestBid}</p>
                                        </div>
                                      </div>
 
        `;
        bidStatus.innerHTML = `<p>${currestBiggestName}'s bid for this item is:</p> <p class="bidnumber">${currentBiggestBid}</p>`;
        for(let i = 0; i < resultsSpec.bids.length; i++) {
          let currentBid = resultsSpec.bids[i].amount;
          let bidderName = resultsSpec.bids[i].bidderName;
          let bidDate = resultsSpec.bids[i].created.slice(0, 10);
          bidders.innerHTML += `
          <p>${bidDate}: ${bidderName} made a bid of: ${currentBid}</p>
          `

          if (largestName === localName) {
            makeBidButton.style.display = "none"
            bidStatus.innerHTML = `<p class="successbig">Happy days! You have the largest bid of ${currentBiggestBid}!</p>`
          }else {
            console.log(error)
          }
        }
       }

      if (sellerEmail !== localEmail) {
        listingSeller.innerHTML += `<div class="seller">
                                      <p>Seller of this product is ${sellerName}</p>
                                      <img class="sellerimage" onerror="this.src='/img/errorperson.png' "src="${sellerAvatar}" alt="Picture of seller">
                                    </div>`
        
      }else {
        console.log(`This is your own listing`)
        listingSeller.innerHTML = "";
        biddingHistory.innerHTML = "";
        listingSeller.innerHTML += `<p class="error">This is your own listing, and you can not bid on it!</p>`
        makeBidButton.style.display = "none";
        yourOwnListing.style.display = "none";

      }

      

  }catch(error) {
    console.log(error)
  }
}

listingSpecs();



/* Make a bid */


function makeBid(listingsBid) {
  
  makeBidButton.addEventListener("click", function(ev) {
    ev.preventDefault();
    gettingBid()

    
    

    async function gettingBid() {
      try {const response = await fetch(specs);
           const resultsSpec = await response.json();
           let largest = 0;
           for(let i = 0; i < resultsSpec.bids.length; i++) {
            if (resultsSpec.bids[i].amount > largest) {
              largest = resultsSpec.bids[i].amount;
            }

          }

           if (resultsSpec._count.bids === 0) {
            

            if (localCredit < 10) {
              alert ("Not enough credit");
              return
              } else {
                const makeBidConst = {
                  method: 'POST',
                  body: JSON.stringify({
                   "amount": 10,
                  }),
                  headers: {
                  'Content-Type': 'application/json',
                   Authorization: `Bearer ${token}`,
                 },
                      
                };
                fetch(`${listingsBid}`, makeBidConst)
                .then((response) => response.json())
                .then((json) => console.log(json));
                let emailUpdate = localStorage.getItem("email");
                let passwordUpdate = localStorage.getItem("password");
          
                fetch(loginUrl, {
                  method: 'POST',
                  body: JSON.stringify({
                  email: emailUpdate,
                  password: passwordUpdate,
                }),
                  headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                  },
                })
                  .then((response) => response.json())
                  .then((json) => console.log(json));
                  statusMessage.innerHTML = '<p class="successbig">Bid successful! Updating..</p>';
                  makeBidButton.style.display = "none";
                  yourOwnListing.style.display = "none";
                  setTimeout(()=> {
                  location.reload()
                  } ,500);
               }

          } else {

            
            let currentBiggestBid = largest+10;
            if (localCredit < currentBiggestBid) {
              console.log("Not enough credit");
              alert ("Not enough credit");
              return
              } else { 
                console.log("success");
               }

            const makeBidConst = {
              method: 'POST',
              body: JSON.stringify({
               "amount": currentBiggestBid,
              }),
              headers: {
              'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
             },
                  
            };
            fetch(`${listingsBid}`, makeBidConst)
            .then((response) => response.json())
            .then((json) => console.log(json));
            statusMessage.innerHTML = '<p class="successbig">Bid successful! Updating..</p>';
            makeBidButton.style.display = "none";
            yourOwnListing.style.display = "none";
            let emailUpdate = localStorage.getItem("email");
            let passwordUpdate = localStorage.getItem("password");
     
            fetch(loginUrl, {
              method: 'POST',
              body: JSON.stringify({
              email: emailUpdate,
              password: passwordUpdate,
            }),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })
              .then((response) => response.json())
              .then((json) => console.log(json));
              setTimeout(()=> {
              location.reload()
              } ,500);

          }   
      }catch(error) {
        console.log(error)
      }

    }


  })
}

makeBid(listingsBid)

