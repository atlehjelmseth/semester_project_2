const api_base_url = 'https://api.noroff.dev';
const create = document.getElementById("create");
const createUrl = `${api_base_url}/api/v1/auction/listings`;
const statusHtml = document.querySelector(".wrongmailorpassword");
const deadLineHtml = document.querySelector(".deadlinedate");  
const titleError = document.querySelector("#title_error");
const descriptionError = document.querySelector("#description_error");
const mediaError = document.querySelector("#media_error");
const localName = localStorage.getItem('name');
const localCredit = localStorage.getItem('credits')
const token = localStorage.getItem('accessToken');

/* This makes the deadlinedate automatically start on tomorrows date */

var today = new Date();
var todayFormatted = new Date().toISOString().split('T')[0];
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
var tomorrowFormatted = tomorrow.toISOString().split('T')[0];

function makeDate() {
  const makeDateInput = document.createElement("input");
  makeDateInput.setAttribute("type", "date");
  makeDateInput.setAttribute("id", "dateEnd");
  makeDateInput.setAttribute("value", tomorrowFormatted);
  makeDateInput.setAttribute("min", tomorrowFormatted)
  deadLineHtml.appendChild(makeDateInput, deadLineHtml);
}

makeDate()

/* This creates the user */

async function createUser(url, userData) {
  statusHtml.innerHTML = '';
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    };
    const response = await fetch(url, postData);
    const json = await response.json();
    console.log(json);
    if (response.status === 201) {
      setTimeout(()=> {
        location.href = "/index.html";
     } ,3000);
      console.log("Registration success");
      statusHtml.innerHTML += `<p class="success">Registration successful! Updating..</p>`;
      create.style.display = "none";
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

/* This start the button-onclick, and checks that all the parameters is correct */

create.onclick = function (ev) {
  ev.preventDefault()
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let media = document.getElementById("media").value;
  let dateEnd = document.getElementById("dateEnd").value + "T00:00:00.000Z";
  console.log(title);
  console.log(description);
  console.log(media);

  const listingToCreate = {
    title: title, 
    description: description,
    media: [media],
    endsAt: dateEnd,
  }

  if(checkLength(title, 0) === true) {
    titleError.style.display = "none";
  } else {
    titleError.style.display = "block";
  }

  if(checkLength(description, 0) === true) {
    descriptionError.style.display = "none";
  } else {
    descriptionError.style.display = "block";
  }


  if(checkLength(media, 0) === true) {
    mediaError.style.display = "none";
  } else {
    mediaError.style.display = "block";
  }


  if(checkLength(title, 1) === true && checkLength(description, 1) && checkLength(media, 1)) {
    createUser(createUrl, listingToCreate)
    
  } else {
    console.log("this went to shit")
  }
}


function checkLength(value, len) {
  if (value.trim().length > len) {
    return true;
  } else {
    return false;
  }
}