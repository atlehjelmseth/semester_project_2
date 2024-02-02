let emailUpdate = localStorage.getItem("email");
let passwordUpdate = localStorage.getItem("password");

const localNameCredit = localStorage.getItem('name');
const creditHtml = document.querySelector('.credit');
const creditUrl = `https://api.noroff.dev/api/v1/auction/auth/login`

async function creditUser(url) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailUpdate,
        password: passwordUpdate,
      }),
    };
    const response = await fetch(url, postData);
    const json = await response.json();
    const credits = json.credits;
    localStorage.setItem('credits', credits);
    let userCredit = localStorage.getItem('credits');
    creditHtml.innerHTML = ""
    creditHtml.innerHTML += `<p class="usercredit">Hi, ${localNameCredit}. Your credit is: ${userCredit}</p>`;
  } catch (error) {
    console.log("error");
  } 
}

creditUser(creditUrl)