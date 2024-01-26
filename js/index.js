const api_base_url = 'https://api.noroff.dev';
const listingsUrl = `${api_base_url}/api/v1/auction/listings`
const token = localStorage.getItem('accessToken');
const userNameProfile = document.querySelector(".username");
const userNameLocal = localStorage.name; 
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
      userNameProfile.innerHTML += `Unknown user`
    } else {
      userNameProfile.innerHTML += `${userNameLocal}`
      loadListingsWithToken(listingsUrl)
    }
  }

  userName()


logoutButton.onclick = function (ev) {
  localStorage.clear();
}


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
        listings.insertAdjacentHTML("beforeend", `<div class="post"><img src="${picture}"><p>${description}</p>`);
        
      }
  } catch(error){
  console.log(error);
}

}


