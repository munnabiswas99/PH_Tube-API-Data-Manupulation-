function getTimeString(time){
    const year = Math.floor(time / 31536000);
    const day = Math.floor(time % 31536000 / 86400);
    const hours = Math.floor(time % 86400 / 3600);
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
    console.log(item);
    const button = document.createElement("button");
    button.classList = "btn";
    button.innerText = item.category;
    categoryContainer.appendChild(button);
  });
};

const loadVideos = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};

const displayVideos = (videos) => {
  videos.forEach((video) => {
    console.log(video);
    const videoContainer = document.getElementById("videos");
    const videoCard = document.createElement("div");
    videoCard.classList = "card bg-base-100";
    videoCard.innerHTML = `
  <figure class="h-[200px] relative">
    <img class="w-full h-full object-cover"
      src="${video.thumbnail}"
      alt="Shoes" />
      ${
        video.others.posted_date.length === 0 ? (
          ""
        ) : (
          `<span class="absolute bottom-2 right-2 bg-black text-white text-xs px-1">
            ${getTimeString(video.others.posted_date)}
          </span>`
        )
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
  </div>`;
    videoContainer.appendChild(videoCard);
  });
};

loadCategories();
loadVideos();
