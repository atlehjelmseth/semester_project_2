const api_base_url = 'https://api.noroff.dev';
const create = document.getElementById("create");
const createUrl = `${api_base_url}/api/v1/auction/listings`;
const statusHtml = document.querySelector(".wrongmailorpassword");
const deadLineHtml = document.querySelector(".deadlinedate");  
const token = localStorage.getItem('accessToken');

var today = new Date();
var todayFormatted = new Date().toISOString().split('T')[0];
console.log(todayFormatted);

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

var tomorrowFormatted = tomorrow.toISOString().split('T')[0];
console.log(tomorrowFormatted)

function makeDate() {
  const makeDateInput = document.createElement("input");
  makeDateInput.setAttribute("type", "date");
  makeDateInput.setAttribute("id", "dateEnd");
  makeDateInput.setAttribute("value", tomorrowFormatted);
  makeDateInput.setAttribute("min", tomorrowFormatted)
  deadLineHtml.appendChild(makeDateInput, deadLineHtml);
}

makeDate()

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
    //   setTimeout(()=> {
    //     location.href = "/index.html";
    //  } ,3000);
      console.log("Registration success");
      statusHtml.innerHTML += `<p class="success">Registration success</p>`;
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

create.onclick = function (ev) {
  ev.preventDefault()
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let media = document.getElementById("media").value;
  let dateEnd = document.getElementById("dateEnd").value + "T00:00:00.000Z";
  console.log(dateEnd);
  console.log(media);

const listingToCreate = {
  title: title, 
  description: description,
  media: [media],
  endsAt: dateEnd,
  }
  createUser(createUrl, listingToCreate)
}


