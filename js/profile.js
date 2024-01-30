const api_base_url = 'https://api.noroff.dev';
const loginUrl = `${api_base_url}/api/v1/auction/auth/login`;
const profileInfo = document.querySelector(".profileinfo");
const statusUpdate = document.querySelector(".status");
const update = document.getElementById("update")
const form = document.querySelector(".form");
const token = localStorage.getItem('accessToken');
const localName = localStorage.getItem('name');
const localCredit = localStorage.getItem('credits');
const userEmail = localStorage.getItem('email');
const userPassword = localStorage.getItem('password');
const avatarUrl = `${api_base_url}/api/v1/auction/profiles/${localName}/media`;

console.log(userEmail, userPassword);


async function loginUser(url) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        "email": userEmail,
        "password": userPassword
       }),
    };
    const response = await fetch(url, postData);
    const json = await response.json();
    console.log(json);
    const name = json.name;
    const avatar = json.avatar;
    const email = json.email;
    const credit = json.credits;
    console.log(name)

    profileInfo.innerHTML = "";
    profileInfo.innerHTML += `
      <div class="spectitle">
      <img onerror="this.src='/img/error.png' "src="${avatar}">
      <div>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Your current credit is: ${credit}</p>
      </div>`
    
  } catch(error) {
    console.log(error);
  }

}
loginUser(loginUrl);



async function createUser(url, userData) {
  try {
    const postData = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    };
    const response = await fetch(url, postData);
    const json = await response.json();
    console.log(json);
    if (json.statusCode === 400) {
      statusUpdate.innerHTML = "";
      statusUpdate.innerHTML += `<p class="failure">${json.errors[0].message}</p>`
    } else {
      statusUpdate.innerHTML = "";
      statusUpdate.innerHTML += `<p class="success">Update successful. Updating...</p>`
      form.style.display = "none";
      console.log("success");
    setTimeout(()=> {
      location.reload()
   } ,3000);}
  } catch(error) {
    console.log(error);
  }

}

update.onclick = function (ev) {
  ev.preventDefault()
  let avatar = document.getElementById("media").value;

  const listingToCreate = {
  avatar: avatar, 
  }
  if (avatar.length < 1 === true) {
    statusUpdate.innerHTML = "";
    statusUpdate.innerHTML = `<p class="failure">This is to short to be a picture-link</p>`;
  } else {
  createUser(avatarUrl, listingToCreate)
}
}
