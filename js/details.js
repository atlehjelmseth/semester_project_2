const api_base_url = 'https://api.noroff.dev';
const listingsUrl = `${api_base_url}/api/v1/auction/listings`
const loginUrl = `${api_base_url}/api/v1/auction/auth/login`
const listingDetails = document.querySelector(".listingdetails");
const listingSeller = document.querySelector(".sellerdetails");
const highestBid = document.querySelector(".highestbid");
const bidders = document.querySelector(".bidders");
const makeBidButton = document.querySelector(".makebidbutton");
const localEmail = localStorage.getItem('email');
const token = localStorage.getItem('accessToken');
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");



const specs = listingsUrl + "/" + id + "?_seller=true&_bids=true";
const listingsBid = listingsUrl + "/" + id + "/bids"
console.log(listingsBid)

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
       let lastElement = resultsSpec.bids[resultsSpec.bids.length - 1];
       const currentBiggestBid = lastElement.amount;
      //  console.log(currentBid);

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
                                       <p>There are no current bids. Be the first!</p>
        `;
       } else {

        listingDetails.innerHTML = "";

        listingDetails.innerHTML += `<button onclick="history.back()"><< Go Back</button> 
                                     <div class="spectitle">
                                       <h1>${title}</h1>
                                       <img onerror="this.src='/img/error.png' "src="${picture}">
                                       <p>${description}</p>
 
        `;
        
        for(let i = 0; i < resultsSpec.bids.length; i++) {
          console.log(resultsSpec.bids[i].amount)
          let currentBid = resultsSpec.bids[i].amount;
          let bidderName = resultsSpec.bids[i].bidderName;

          bidders.innerHTML += `
          <p>${bidderName} made a bid of: ${currentBid}</p>
          `
        }

       }


      if (sellerEmail !== localEmail) {
        console.log(`Seller is ${sellerName}`)


        listingSeller.innerHTML += `<div class="seller">
                                      <p>Seller of this product is ${sellerName}</p><p>Current bid for this item is ${currentBiggestBid}</p>
                                      <img class="sellerimage" onerror="this.src='/img/error.png' "src="${sellerAvatar}">
                                    </div>`
      }else {
        console.log(`This is your own listing`)
        listingSeller.innerHTML = "";

        listingSeller.innerHTML += `<p>This is your own listing, and you can not bid on it!</p>`
        makeBidButton.style.display = "none";

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

           let lastElement = resultsSpec.bids[resultsSpec.bids.length - 1];
           const currentBiggestBid = lastElement.amount+1;
           console.log(currentBiggestBid);

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
          .then(() => console.log(obj));
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
    
      }catch(error) {
        console.log("This went to hell")
      }

    }


        })
        }

        makeBid(listingsBid)

