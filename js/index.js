const api_base_url = 'https://api.noroff.dev';
const listingsUrl = `${api_base_url}/api/v1/auction/listings`
const listingsSorted = `${api_base_url}/api/v1/auction/listings?sort=created&sortOrder=desc&_active=true&limit=8&offset=0`;
const listingsSortedNext = `${api_base_url}/api/v1/auction/listings?sort=created&sortOrder=desc&_active=true&limit=8&offset=`;
const loginUrl = `${api_base_url}/api/v1/auction/auth/login`
const token = localStorage.getItem('accessToken');
const localName = localStorage.getItem('name');
const userNameProfile = document.querySelector(".username");
const userCredit = localStorage.getItem('credits');
const creditHtml = document.querySelector('.credit');
const profileLink = document.querySelector(".profile_link");
const createListing = document.querySelector(".create_listing");
const loginButton = document.querySelector(".loginbutton");
const logoutButton = document.querySelector(".logoutbutton");
const listings = document.querySelector(".listings");
const viewMore = document.querySelector(".viewMore");

console.log(listingsSorted);
console.log(userCredit);


const userToLogin = {
  email: localStorage.getItem('email'),
  password: localStorage.getItem('password'),
  }

  console.log(userToLogin, token);

function userName () {
  if (localStorage.name === undefined) {
    localStorage.setItem('viewPage', 8);
    profileLink.style.display = "none";
    logoutButton.style.display = "none";
    createListing.style.display = "none";
    loadListingsUnregistered(listingsSorted)
    viewMore.addEventListener("click", function() {
      let viewPage = parseInt(localStorage.getItem('viewPage'));
      localStorage.setItem('viewPage', viewPage+8)
      loadListingsUnregistered(listingsSortedNext+viewPage)
    });
    
  } else {
    localStorage.setItem('viewPage', 8);
    loadListingsWithToken(listingsSorted)
    loginButton.style.display = "none";
    creditHtml.innerHTML += `<p class="usercredit">Hi, ${localName}. Your credit is: ${userCredit}</p>`;
    viewMore.addEventListener("click", function() {
      let viewPage = parseInt(localStorage.getItem('viewPage'));
      localStorage.setItem('viewPage', viewPage+8)
      loadListingsWithToken(listingsSortedNext+viewPage)
    });
    
  }
}

userName()




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
          var picture = "https://gfx.nrk.no/9EoNSgFcMNNAsWwMZ3f2Jw9N-VRC_cvFvbUI0c51Tzpg.jpg";
        } else {
          var picture = jsonListings[i].media[0];
        }
        listings.insertAdjacentHTML("beforeend", `<div class="post"><img src="${picture}"><p>${description}</p><p>Current bid: ${currentBidButton}</p></div>`);
/* Make bids */
        const makeBidButton = document.createElement("button");
        makeBidButton.innerText = `View More`;
        makeBidButton.setAttribute("id", "makebid");
        
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
        // }
        // makeBid(listingId)
        listings.appendChild(makeBidButton);
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
          var description  = jsonListings[i].description;
          if (jsonListings[i].description === "") {
            var description  = "This listing has no description";
          } else {
            var description  = jsonListings[i].description;
          }
          if (jsonListings[i].media[0] === undefined) {
            var picture = "https://gfx.nrk.no/9EoNSgFcMNNAsWwMZ3f2Jw9N-VRC_cvFvbUI0c51Tzpg.jpg";
          } else {
            var picture = jsonListings[i].media[0];
          }
          listings.insertAdjacentHTML("beforeend", `<div class="post"><img src="${picture}"><p>${description}</p><a href="/login.html">LOG IN TO MAKE A BID</a>`);
          
        }
    } catch(error){
    console.log(error);
  }
  }

}

logoutButton.onclick = function (ev) {
  localStorage.clear(ev);
}
