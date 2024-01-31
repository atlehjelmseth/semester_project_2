const loginButton = document.querySelector(".loginbutton");
const logoutButton = document.querySelector(".logoutbutton");
const viewMoreHidden = document.querySelector(".viewmore");
const profileLink = document.querySelector(".profile_link");
const createListing = document.querySelector(".create_listing");

function userName () {
  if (localStorage.name === undefined) {
    profileLink.style.display = "none";
    logoutButton.style.display = "none";
    createListing.style.display = "none";
    viewMoreHidden.style.display = "none"
  } else {
    loginButton.style.display = "none";
  }
}

userName()

logoutButton.onclick = function (ev) {
  localStorage.clear(ev);
}
