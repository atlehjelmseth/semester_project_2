const api_base_url = 'https://api.noroff.dev';
const listingsUrl = `${api_base_url}/api/v1/auction/listings?sort=created&sortOrder=desc&_active=true`
const token = localStorage.getItem('accessToken');
const userNameProfile = document.querySelector(".username");
const userNameLocal = localStorage.name; 
const profileLink = document.querySelector(".profile_link");
const createListing = document.querySelector(".create_listing");
const loginButton = document.querySelector(".loginbutton");
const logoutButton = document.querySelector(".logoutbutton");
const listings = document.querySelector(".listings");

console.log(listingsUrl);
console.log(userNameLocal);


const userToLogin = {
  email: localStorage.getItem('email'),
  password: localStorage.getItem('password'),
  }

  console.log(userToLogin, token);

function userName () {
  if (localStorage.name === undefined) {
    profileLink.style.display = "none";
    logoutButton.style.display = "none";
    createListing.style.display = "none";
    loadListingsUnregistered(listingsUrl)
  } else {
    loadListingsWithToken(listingsUrl)
    loginButton.style.display = "none";
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
        if (i === 10) { break; }
        var description  = jsonListings[i].description;
        var listingId = jsonListings[i].id;

  

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
        listings.insertAdjacentHTML("beforeend", `<div class="post"><img src="${picture}"><p>${description}</p></div>`);
        
        const makeBidButton = document.createElement("button");
        makeBidButton.innerText = `Make bid`;
        makeBidButton.setAttribute("id", "makebid");

        function makeBid(listingId) {
          makeBidButton.addEventListener("click", function() {
            const makeBidConst = {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              Authorization: `Bearer ${token}`
            },
          };
          fetch(`${listingsUrl}/${listingId}/bids`, makeBidConst)
            .then((response) => response.json())
            .then((json) => console.log(json));
            setTimeout(()=> {
              location.reload()
           } ,500);
          })
        }
        makeBid(listingId)
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
          if (i === 10) { break; }
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
  localStorage.clear();
}
