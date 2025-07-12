function getTimeString(time) {
  const year = Math.floor(time / 31536000);
  const day = Math.floor((time % 31536000) / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${year}y ${day}d ${hours}h ${minutes}m ${seconds}s`;
}

console.log("Video script loaded");
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};

const displayCategories = (catagories) => {
  const categoryContainer = document.getElementById("categories");

  catagories.forEach((item) => {
    // console.log(item);
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
    <button id="btn-${item.category_id}" class="btn category-btn" onclick="loadCategoryVideos(${item.category_id})">
      ${item.category}
    </button>
    `;
    categoryContainer.appendChild(buttonContainer);
  });
};

const loadVideos = (searchText = '') => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("btn-active");
  }
}

const loadCategoryVideos = (categoryId) => {
  // alert(categoryId);
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/category/${categoryId}`
  )
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const activeButton = document.getElementById(`btn-${categoryId}`);
      activeButton.classList.add("btn-active");
      displayVideos(data.category);
    })
    .catch((error) => console.log(error));
};

const loadDetails = async (videoId) => {
  const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const response = await fetch(uri);
  const data = await response.json();
  displayDetails(data.video);

}

const displayDetails  = (video) => {
  const videoDetailsContainer = document.getElementById("videoDetails");
  videoDetailsContainer.innerHTML = `
  <img class="w-full h-64 object-cover mb-4" src="${video.thumbnail}" alt="${video.title}"/>
  <h3 class="text-xl font-bold">${video.title}</h3>
  <p class="text-gray-600">${video.description}</p>
  `; 
  document.getElementById("customModal").showModal();
  console.log(video);
}

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = ""; // Clear previous videos

  if(videos.length === 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
    <div class="flex flex-col items-center justify-center h-screen">
      <img class="w-20 h-20 mx-auto my-10" src="assets/Icon.png"/>
      <h2 class="text-center text-2xl">No videos found</h2>
    </div>
    `;
    return;
  }
  else{
    videoContainer.classList.add("grid");
  }

  videos.forEach((video) => {
    const videoCard = document.createElement("div");
    videoCard.classList = "card bg-base-100";
    videoCard.innerHTML = `
  <figure class="h-[200px] relative">
    <img class="w-full h-full object-cover"
      src="${video.thumbnail}"
      alt="Shoes" />
      ${
        video.others.posted_date.length === 0
          ? ""
          : `<span class="absolute bottom-2 right-2 bg-black text-white text-xs px-1">
            ${getTimeString(video.others.posted_date)}
          </span>`
      }
  </figure>
  <div class="px-0 py-2 flex gap-2">
    <div>
        <img class="w-10 h-10 rounded-full" src="${
          video.authors[0].profile_picture
        }"/>
    </div>
    <div>
        <h2>${video.title}</h2>
        <div class="flex items-center gap-2">
          <p>${video.authors[0].profile_name}</p>
          ${
            video.authors[0].verified === true
              ? '<img class="w-4 h-4" src="https://img.icons8.com/?size=96&id=D9RtvkuOe31p&format=png"/>'
              : ""
          }
        </div>
        <p>${video.others.views} views</p>
        

    </div>
    <button onclick="loadDetails('${video.video_id}')" class="btn bg-rose-700 text-white">Details</button>
  </div>`;
    videoContainer.appendChild(videoCard);
  });
};
document.getElementById("searchInput").addEventListener("keyup", (e) => {
  console.log(e.target.value);
  const searchText = e.target.value.toLowerCase();
  loadVideos(searchText);

});
loadCategories();
loadVideos();
