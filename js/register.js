const api_base_url = 'https://api.noroff.dev';
const register = document.getElementById("register");
const registerUrl = `${api_base_url}/api/v1/auction/auth/register`;
const statusHtml = document.querySelector(".wrongmailorpassword");

async function registerUser(url, userData) {
  statusHtml.innerHTML = '';
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    const response = await fetch(url, postData);
    const json = await response.json();
    console.log(json);
    if (response.status === 201) {
      setTimeout(()=> {
        location.href = "/login.html";
     } ,3000);
      console.log("Registration success");
      statusHtml.innerHTML += `<p class="success">Registration successful! Redirecting..</p>`;
      register.style.display = "none";
    } else {
      console.log("Could not registrate new user");
    } 
    if(json.statusCode === 400) {
      for(let i = 0; i < json.errors.length; i++) {
        const errorHtml = json.errors[i].message;
        statusHtml.innerHTML += `<p class="error">${errorHtml}</p>`;
      }
    }else {
      console.log("Registration was a success")
    }
  } catch(error) {
    console.log(error);
  }

}

register.onclick = function (ev) {
  ev.preventDefault()
  let name = document.getElementById("username").value;
  let email = document.getElementById("email").value.toLowerCase();
  let password = document.getElementById("password").value;


const userToRegister = {
  name: name, 
  email: email,
  password: password,
  }
  registerUser(registerUrl, userToRegister)
}


