const api_base_url = 'https://api.noroff.dev';
const loginUrl = `${api_base_url}/api/v1/auction/auth/login`
const login = document.getElementById("login");
const wrong = document.querySelector(".wrongmailorpassword");



async function loginUser(url, userData) {
  wrong.innerHTML = '';
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
    const accessToken = json.accessToken;
    const userEmail = json.email;
    const userName = json.name;
    const avatar = json.avatar;
    const credits = json.credits;
    const status = response.status;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('email', userEmail);
    localStorage.setItem('name', userName);
    localStorage.setItem('avatar', avatar);
    localStorage.setItem('credits', credits);

    if (status === 200) {
      console.log("Login success");
      location.href = "/index.html";
    } else {
      wrong.innerHTML += `<p class="error">Wrong email or password, please try again</p>`;
    } return false;
  } catch (error) {
    console.log(error);
  } 
}



login.onclick = function (ev) {
  ev.preventDefault()

  let email = document.getElementById("email").value.toLowerCase();
  let password = document.getElementById("password").value;

const userToLogin = {
  email: email,
  password: password,
  }
  localStorage.setItem('password', password);
  loginUser(loginUrl, userToLogin);

}

function clearOutStorage() {
  localStorage.clear();
}

clearOutStorage()