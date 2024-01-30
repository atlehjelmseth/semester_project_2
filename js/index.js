const api_base_url = 'https://api.noroff.dev';
const listingsUrl = `${api_base_url}/api/v1/auction/listings`
const listingsSorted = `${api_base_url}/api/v1/auction/listings?sort=created&sortOrder=desc&_active=true&limit=6&offset=0`;
const listingsSortedNext = `${api_base_url}/api/v1/auction/listings?sort=created&sortOrder=desc&_active=true&limit=6&offset=`;
const loginUrl = `${api_base_url}/api/v1/auction/auth/login`
const searchUrl = `${api_base_url}/api/v1/auction/listings?sort=created&sortOrder=desc&_active=true`
const token = localStorage.getItem('accessToken');
const localName = localStorage.getItem('name');
const userNameProfile = document.querySelector(".username");
const userCredit = localStorage.getItem('credits');
const creditHtml = document.querySelector('.credit');
const profileLink = document.querySelector(".profile_link");
const createListing = document.querySelector(".create_listing");
const listings = document.querySelector(".listings");
const viewMore = document.querySelector(".viewmore");
const search = document.querySelector(".search");

console.log(listingsSorted);
console.log(userCredit);



const userToLogin = {
  email: localStorage.getItem('email'),
  password: localStorage.getItem('password'),
  }

  console.log(userToLogin, token);

function authOrNot () {
  if (localStorage.name === undefined) {
    loadListingsUnregistered(listingsSorted)    
  } else {
    localStorage.setItem('viewPage', 6);
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
        var listingId = jsonListings[i].id;
        var currentBidButton = jsonListings[i]._count.bids;
        console.log(description);   
        if (jsonListings[i].title === "") {
          var title  = "No title";
        } else {
          var title  = jsonListings[i].title;
        }
        if (jsonListings[i].description === "") {
          var description  = "No description";
        } else {
          var description  = jsonListings[i].description;
        }
        if (jsonListings[i].media[0] === undefined) {
          var picture = "/img/error.png";
        } else {
          var picture = jsonListings[i].media[0];
        }
        listings.insertAdjacentHTML("beforeend", `<div class="post col-md-3"><img onerror="this.src='/img/error.png' "src="${picture}"><p>${title}</p><p>${description}</p><p class="currentbid">Number of bids: ${currentBidButton}</p><a href="details.html?id=${listingId}" class="view_more_button">View More</a></div>`);
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
          if (jsonListings[i].title === "") {
            var title  = "No title";
          } else {
            var title  = jsonListings[i].title;
          }
          if (jsonListings[i].description === "") {
            var description  = "No description";
          } else {
            var description  = jsonListings[i].description;
          }
          if (jsonListings[i].media[0] === undefined) {
            var picture = "/img/error.png";
          } else {
            var picture = jsonListings[i].media[0];
          }
          listings.insertAdjacentHTML("beforeend", `<div class="post col-3"><img onerror="this.src='/img/error.png' " src="${picture}"><p>${title}</p><p>${description}</p><a href="/login.html" class="view_more_button">Log in to view</a>`);
          
        }
    } catch(error){
    console.log(error);
  }
  }

}

/* Search bar */

search.onkeyup = async function (event) {
  
  if (localStorage.name === undefined) {
    try {
      const searchListings = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

        },
      };
      const response = await fetch(searchUrl, searchListings);
      const jsonListings = await response.json();
      console.log(jsonListings)
      const searchValue = event.target.value.toLowerCase();
  
      const searchResults = jsonListings.filter(function (search) {
        if (JSON.stringify(search.title).toLowerCase().includes(searchValue)) {
            return true;
        }  
      });
  
    console.log(searchResults);
    listings.innerHTML = "";
  
    for(let i = 0; i < searchResults.length; i++){
      if (i === 6) { break; }
      listings.innerHTML += `<div class="post col-3"><img onerror="this.src='/img/error.png' " src="${searchResults[i].media[0]}"><p>${searchResults[i].title}</p><p>${searchResults[i].description}</p><a href="/login.html" class="view_more_button">Log in to view</a>`
    }

    }catch{
      console.log("error");
    }
    
  } else {
    try {
      const searchListings = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      };
      const response = await fetch(searchUrl, searchListings);
      const jsonListings = await response.json();
      console.log(jsonListings)
      const searchValue = event.target.value.toLowerCase();
  
      const searchResults = jsonListings.filter(function (search) {
        if (JSON.stringify(search.title).toLowerCase().includes(searchValue) || JSON.stringify(search.description).toLowerCase().includes(searchValue)) {
            return true;
        }  
      });
  
    console.log(searchResults);
    listings.innerHTML = "";
  
    for(let i = 0; i < searchResults.length; i++){
      if (i === 6) { break; }
      listings.innerHTML += `<div class="post col-md-3"><img onerror="this.src='/img/error.png' "src="${searchResults[i].media[0]}"><p>${searchResults[i].title}</p><p>${searchResults[i].description}</p><p class="currentbid">Number of bids: ${searchResults[i]._count.bids}</p><a href="details.html?id=${searchResults[i].id}" class="view_more_button">View More</a></div>`
    }
    console.log(searchValue.length)
  
    if (searchValue.length === 0) {
      viewMore.style.display = "flex";
    } else {
      viewMore.style.display = "none";
    }
    }catch{
      console.log("error");
    }
    
  }
  


}
