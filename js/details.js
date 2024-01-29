const api_base_url = 'https://api.noroff.dev';
const listingsUrl = `${api_base_url}/api/v1/auction/listings`
const loginUrl = `${api_base_url}/api/v1/auction/auth/login`
const listingDetails = document.querySelector(".listingdetails");
const listingSeller = document.querySelector(".sellerdetails");
const highestBid = document.querySelector(".highestbid");
const bidders = document.querySelector(".bidders");
const bidStatus = document.querySelector(".bidstatus");
const makeBidButton = document.querySelector(".makebidbutton");
const creditHtml = document.querySelector('.credit');
const yourOwnListing = document.querySelector(".yourownlisting");
const localEmail = localStorage.getItem('email');
const localName = localStorage.getItem('name');
const localCredit = localStorage.getItem('credits')
const token = localStorage.getItem('accessToken');
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");



const specs = listingsUrl + "/" + id + "?_seller=true&_bids=true";
const listingsBid = listingsUrl + "/" + id + "/bids"

function creditStatus () {
  creditHtml.innerHTML = ""
  creditHtml.innerHTML += `<p class="usercredit">Hi, ${localName}. Your credit is: ${localCredit}</p>`;
}

creditStatus()

async function listingSpecs() {
  try {const response = await fetch(specs);
       const resultsSpec = await response.json();
       console.log(resultsSpec);
       const title = resultsSpec.title;
       const picture = resultsSpec.media[0];
       const description = resultsSpec.description;
       const sellerName = resultsSpec.seller.name;
       const sellerEmail = resultsSpec.seller.email;
       const sellerAvatar = resultsSpec.seller.avatar;

       if (resultsSpec._count.bids === 0) {
        let currentBid = 0;
        let bidderName = "no one";

        console.log(currentBid, bidderName);
        listingDetails.innerHTML = "";

        listingDetails.innerHTML += `<button onclick="history.back()"><< Go Back</button> 
                                     <div class="spectitle">
                                       <h1>${title}</h1>
                                       <img onerror="this.src='/img/error.png' "src="${picture}">
                                       <p>${description}</p>
        `;
        yourOwnListing.innerHTML = "";
        yourOwnListing.innerHTML += `<p>There are no current bids. Be the first!</p>`;
        
       } else {
        let lastElement = resultsSpec.bids[resultsSpec.bids.length - 1];
        let currentBiggestBid = lastElement.amount;
        listingDetails.innerHTML = "";

        listingDetails.innerHTML += `<button onclick="history.back()"><< Go Back</button> 
                                     <div class="spectitle">
                                       <h1>${title}</h1>
                                       <img onerror="this.src='/img/error.png' "src="${picture}">
                                       <p>${description}</p>
                                       <p>Current bid for this item is ${currentBiggestBid}</p>
 
        `;
        
        for(let i = 0; i < resultsSpec.bids.length; i++) {
          console.log(resultsSpec.bids[i].amount)
          let lastElementBidder = resultsSpec.bids[resultsSpec.bids.length - 1];
          let currentBiggestBidBidder = lastElementBidder.bidderName;
          let currentBid = resultsSpec.bids[i].amount;
          let bidderName = resultsSpec.bids[i].bidderName;

          bidders.innerHTML += `
          <p>${bidderName} made a bid of: ${currentBid}</p>
          `

          if (currentBiggestBidBidder === localName) {
            makeBidButton.style.display = "none"
            console.log("you have the largest bid");
            bidStatus.innerHTML = `<p class="youhavelargestbid">You have the largest bid</p>`
          }else {
            console.log("bid away")
          }

        }

       }


      if (sellerEmail !== localEmail) {
        console.log(`Seller is ${sellerName}`)
        

        listingSeller.innerHTML += `<div class="seller">
                                      <p>Seller of this product is ${sellerName}</p>
                                      <img class="sellerimage" onerror="this.src='/img/error.png' "src="${sellerAvatar}">
                                    </div>`
        
      }else {
        console.log(`This is your own listing`)
        listingSeller.innerHTML = "";

        listingSeller.innerHTML += `<p>This is your own listing, and you can not bid on it!</p>`
        makeBidButton.style.display = "none";
        yourOwnListing.style.display = "none";

      }

      

  }catch(error) {
    console.log("This went to hell")
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
           console.log(resultsSpec);

           if (resultsSpec._count.bids === 0) {
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
            let emailUpdate = localStorage.getItem("email");
            let passwordUpdate = localStorage.getItem("password");
            console.log(emailUpdate, passwordUpdate);
      
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
              .then((json) => localStorage.setItem('credits', json.credits));
              setTimeout(()=> {
              location.reload()
              } ,500);
          } else {
            let lastElement = resultsSpec.bids[resultsSpec.bids.length - 1];
            let currentBiggestBid = lastElement.amount+10;

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
            let emailUpdate = localStorage.getItem("email");
            let passwordUpdate = localStorage.getItem("password");
            console.log(emailUpdate, passwordUpdate);
      
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
              .then((json) => localStorage.setItem('credits', json.credits));
              setTimeout(()=> {
              location.reload()
              } ,500);

          }   
      }catch(error) {
        console.log("This went to hell")
      }

    }


  })
}

makeBid(listingsBid)