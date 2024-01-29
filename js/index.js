const api_base_url = 'https://api.noroff.dev';
const listingsUrl = `${api_base_url}/api/v1/auction/listings`
const listingsSorted = `${api_base_url}/api/v1/auction/listings?sort=created&sortOrder=desc&_active=true&limit=9&offset=0`;
const listingsSortedNext = `${api_base_url}/api/v1/auction/listings?sort=created&sortOrder=desc&_active=true&limit=9&offset=`;
const loginUrl = `${api_base_url}/api/v1/auction/auth/login`
const token = localStorage.getItem('accessToken');
const localName = localStorage.getItem('name');
const userNameProfile = document.querySelector(".username");
const userCredit = localStorage.getItem('credits');
const creditHtml = document.querySelector('.credit');
const profileLink = document.querySelector(".profile_link");
const createListing = document.querySelector(".create_listing");
const listings = document.querySelector(".listings");
const viewMore = document.querySelector(".viewmore");

console.log(listingsSorted);
console.log(userCredit);



const userToLogin = {
  email: localStorage.getItem('email'),
  password: localStorage.getItem('password'),
  }

  console.log(userToLogin, token);

function authOrNot () {
  if (localStorage.name === undefined) {
    localStorage.setItem('viewPage', 9);
    loadListingsUnregistered(listingsSorted)
    viewMore.addEventListener("click", function() {
      let viewPage = parseInt(localStorage.getItem('viewPage'));
      localStorage.setItem('viewPage', viewPage+9)
      loadListingsUnregistered(listingsSortedNext+viewPage)
    });
    
  } else {
    localStorage.setItem('viewPage', 9);
    loadListingsWithToken(listingsSorted)
    creditHtml.innerHTML += `<p class="usercredit">Hi, ${localName}. Your credit is: ${userCredit}</p>`;
    viewMore.addEventListener("click", function() {
      let viewPage = parseInt(localStorage.getItem('viewPage'));
      localStorage.setItem('viewPage', viewPage+9)
      loadListingsWithToken(listingsSortedNext+viewPage)
    });
    
  }
}

authOrNot()



async function loadListingsWithToken (url) {
  try {
    const fetchListings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    };
    const response = await fetch(url, fetchListings);
    const jsonListings = await response.json();
    console.log(jsonListings)

      for(let i = 0; i < jsonListings.length; i++) {
        var listigTitle = jsonListings[i].title;
        var description  = jsonListings[i].description;
        var listingId = jsonListings[i].id;
        var currentBidButton = jsonListings[i]._count.bids;
        console.log(description);   

        if (jsonListings[i].description === "") {
          var description  = "This listing has no description";
        } else {
          var description  = jsonListings[i].description;
        }
        if (jsonListings[i].media[0] === undefined) {
          var picture = "/img/error.png";
        } else {
          var picture = jsonListings[i].media[0];
        }
        listings.insertAdjacentHTML("beforeend", `<div class="post col-3"><img onerror="this.src='/img/error.png' "src="${picture}"><p>${listigTitle}</p><p>${description}</p><p class="currentbid">Number of bids: ${currentBidButton}</p><a href="details.html?id=${listingId}" class="view_more_button">View More</a></div>`);
/* Make bids */

        // function makeBid(listingId) {
        //   makeBidButton.addEventListener("click", function(event) {
        //     event.preventDefault();
        //     var currentBid = jsonListings[i]._count.bids+1;
        //     console.log(currentBid)
            
        //       const makeBidConst = {
        //         method: 'POST',
        //         body: JSON.stringify({
        //           "amount": 17
        //         }),
        //         headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${token}`,
        //         },
            
        //   };
        //     fetch(`${listingsUrl}/${listingId}/bids`, makeBidConst)
        //     .then((response) => response.json())
        //     .then((json) => console.log(json));
            // let emailUpdate = localStorage.getItem("email");
            // let passwordUpdate = localStorage.getItem("password");
            // console.log(emailUpdate, passwordUpdate);
            // fetch(loginUrl, {
            //   method: 'POST',
            //   body: JSON.stringify({
            //     email: emailUpdate,
            //     password: passwordUpdate,
            //   }),
            //   headers: {
            //     'Content-type': 'application/json; charset=UTF-8',
            //   },
            // })
            //   .then((response) => response.json())
            //   .then((json) => localStorage.setItem('credits', json.credits));
          //   setTimeout(()=> {
          //     location.reload()
          //  } ,500);
        //   })
        // // }
        // makeBid(listingId)
        // listings.appendChild(makeBidButton);

        // function makeBid(listingId) {
        //   makeBidButton.addEventListener("click", function(event) {
        //     event.preventDefault();
        //     var currentBid = jsonListings[i]._count.bids;
        //     console.log(currentBid, listingId)
            
        //   })
        // }
      }

  } catch(error){
  console.log(error);
}

}

async function loadListingsUnregistered(url, method = 'GET') {
  {
    try {
      const listingsUnreg = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(url, listingsUnreg);
      const jsonListings = await response.json();
      console.log(jsonListings)

  
        for(let i = 0; i < jsonListings.length; i++) {
          var title = jsonListings[i]
          var description  = jsonListings[i].description;
          if (jsonListings[i].description === "") {
            var description  = "This listing has no description";
          } else {
            var description  = jsonListings[i].description;
          }
          if (jsonListings[i].media[0] === undefined) {
            var picture = "/img/error.png";
          } else {
            var picture = jsonListings[i].media[0];
          }
          listings.insertAdjacentHTML("beforeend", `<div class="post col-3"><img onerror="this.src='/img/error.png' " src="${picture}"><p>${description}</p><a href="/login.html" class="view_more_button">Log in to view</a>`);
          
        }
    } catch(error){
    console.log(error);
  }
  }

}
