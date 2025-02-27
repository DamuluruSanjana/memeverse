// Imgflip API credentials
const username = "damulurusanjana"; // Your Imgflip username
const password = "sanjana2003"; // Your Imgflip password

//exp pg
let currentPage = 1; // Track the current page of memes
let isLoading = false; // Prevent multiple API calls
let searchQuery = ""; // Track the search query
let selectedCategory = "trending"; // Default category
let sortBy = "likes"; // Default sort by
//exp pg

// Function to fetch trending memes from Imgflip API
async function fetchTrendingMemes() {
    const url = `https://api.imgflip.com/get_memes`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response:", data); // Debugging: Log the API response
        if (data.success) {
            return data.data.memes; // Array of meme objects
        } else {
            console.error("Failed to fetch memes:", data.error_message);
            return getStaticMemes(); // Fallback to static memes
        }
    } catch (error) {
        console.error("Error fetching memes:", error);
        return getStaticMemes(); // Fallback to static memes
    }
}

// Static memes for testing
function getStaticMemes() {
    return [
        {
            id: "1",
            url: "https://i.imgflip.com/1bij.jpg",
            name: "Doge",
            width: 500,
            height: 500,
        },
        {
            id: "2",
            url: "https://i.imgflip.com/1bhw.jpg",
            name: "Grumpy Cat",
            width: 500,
            height: 500,
        },
        {
            id: "3",
            url: "https://i.imgflip.com/1bik.jpg",
            name: "Drake Hotline Bling",
            width: 500,
            height: 500,
        },
    ];
}

// Function to display trending memes
async function displayTrendingMemes() {
    const memesContainer = document.getElementById("memes-container");
    const loadingSpinner = document.getElementById("loading-spinner");

    // Check if elements exist
    if (!memesContainer || !loadingSpinner) {
        console.error("Required elements (memes-container or loading-spinner) not found.");
        return;
    }

    memesContainer.innerHTML = ""; // Clear previous content
    loadingSpinner.style.display = "block"; // Show loading spinner

    const memes = await fetchTrendingMemes();
    loadingSpinner.style.display = "none"; // Hide loading spinner

    if (memes.length === 0) {
        memesContainer.innerHTML = "<p>No memes found.</p>";
        return;
    }

    memes.forEach(meme => {
        const memeCard = document.createElement("div");
        memeCard.classList.add("meme-card");

        const memeImage = document.createElement("img");
        memeImage.src = meme.url;
        memeImage.alt = meme.name;

        const memeLikes = document.createElement("p");
        memeLikes.textContent = `Likes: ${meme.width * meme.height}`; // Placeholder for likes

        memeCard.appendChild(memeImage);
        memeCard.appendChild(memeLikes);
        memesContainer.appendChild(memeCard);
    });

    // Initialize ScrollReveal for meme cards (if ScrollReveal is available)
    if (typeof ScrollReveal !== "undefined") {
        ScrollReveal().reveal('.meme-card', {
            delay: 200,
            distance: '20px',
            origin: 'bottom',
            interval: 100,
            easing: 'ease-in-out',
        });
    }
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
if (darkModeToggle) {
    const body = document.body;
    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        body.classList.toggle("light-mode");
        const isDarkMode = body.classList.contains("dark-mode");
        darkModeToggle.textContent = isDarkMode ? "🌙" : "☀️";
    });
}

// Call the function to display memes when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    displayTrendingMemes();
});

// home page ends here------------------------------------------------------------------------------------------------------------------------


// Function to fetch memes from Imgflip API
async function fetchMemes(page = 1, query = "", category = "trending", sort = "likes") {
    const url = `https://api.imgflip.com/get_memes`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response:", data); // Debugging: Log the API response
        if (data.success) {
            let memes = data.data.memes;

            // Filter memes based on the search query
            if (query) {
                memes = memes.filter(meme =>
                    meme.name.toLowerCase().includes(query.toLowerCase())
                );
            }

            // Sort memes
            if (sort === "likes") {
                memes.sort((a, b) => (b.width * b.height) - (a.width * a.height)); // Placeholder for likes
            } else if (sort === "date") {
                memes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Placeholder for date
            } else if (sort === "comments") {
                memes.sort((a, b) => b.comments - a.comments); // Placeholder for comments
            }

            return memes;
        } else {
            console.error("Failed to fetch memes:", data.error_message);
            return [];
        }
    } catch (error) {
        console.error("Error fetching memes:", error);
        return [];
    }
}

// Function to display memes
async function displayMemes() {
    const memesContainer = document.getElementById("memes-container");
    const loadingSpinner = document.getElementById("loading-spinner");

    memesContainer.innerHTML = ""; // Clear previous content
    loadingSpinner.style.display = "block"; // Show loading spinner

    const memes = await fetchMemes(currentPage, searchQuery, selectedCategory, sortBy);
    loadingSpinner.style.display = "none"; // Hide loading spinner

    if (memes.length === 0) {
        memesContainer.innerHTML = "<p>No memes found.</p>";
        return;
    }

    memes.forEach(meme => {
        const memeCard = document.createElement("div");
        memeCard.classList.add("meme-card");

        const memeImage = document.createElement("img");
        memeImage.src = meme.url;
        memeImage.alt = meme.name;

        const memeLikes = document.createElement("p");
        memeLikes.textContent = `Likes: ${meme.width * meme.height}`; // Placeholder for likes

        memeCard.appendChild(memeImage);
        memeCard.appendChild(memeLikes);
        memesContainer.appendChild(memeCard);
    });

    // Initialize ScrollReveal for meme cards
    ScrollReveal().reveal('.meme-card', {
        delay: 200,
        distance: '20px',
        origin: 'bottom',
        interval: 100,
        easing: 'ease-in-out',
    });
}

// Function to load more memes when the user scrolls to the bottom
async function loadMoreMemes() {
    if (isLoading) return; // Prevent multiple API calls
    isLoading = true;

    const loadMoreSpinner = document.createElement("div");
    loadMoreSpinner.id = "load-more-spinner";
    loadMoreSpinner.textContent = "Loading more memes...";
    document.getElementById("meme-explorer").appendChild(loadMoreSpinner);

    currentPage += 1;
    const memes = await fetchMemes(currentPage, searchQuery, selectedCategory, sortBy);

    if (memes.length === 0) {
        loadMoreSpinner.textContent = "No more memes to load.";
        return;
    }

    const memesContainer = document.getElementById("memes-container");
    memes.forEach(meme => {
        const memeCard = document.createElement("div");
        memeCard.classList.add("meme-card");

        const memeImage = document.createElement("img");
        memeImage.src = meme.url;
        memeImage.alt = meme.name;

        const memeLikes = document.createElement("p");
        memeLikes.textContent = `Likes: ${meme.width * meme.height}`; // Placeholder for likes

        memeCard.appendChild(memeImage);
        memeCard.appendChild(memeLikes);
        memesContainer.appendChild(memeCard);
    });

    loadMoreSpinner.remove();
    isLoading = false;
}

// Debounce function to limit API calls
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Handle search input with debouncing
const searchInput = document.getElementById("search-input");
searchInput.addEventListener(
    "input",
    debounce(() => {
        searchQuery = searchInput.value.trim();
        currentPage = 1; // Reset pagination for new search
        displayMemes();
    }, 300) // 300ms debounce delay
);

// Handle category filter change
const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListener("change", () => {
    selectedCategory = categoryFilter.value;
    currentPage = 1; // Reset pagination for new category
    displayMemes();
});

// Handle sort by change
const sortBySelect = document.getElementById("sort-by");
sortBySelect.addEventListener("change", () => {
    sortBy = sortBySelect.value;
    currentPage = 1; // Reset pagination for new sort
    displayMemes();
});

// Add scroll event listener for infinite scrolling
window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadMoreMemes();
    }
});

// Call the function to display memes when the page loads
window.onload = displayMemes;

//exp page ends here-----------------------------------------------------------------------------------------------------------------------------
// ImgBB API Key
const imgbbApiKey = "069807710dbb9aafdf0d152544700576"; // Your ImgBB API key

// Function to upload image to ImgBB
async function uploadImageToImgBB(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error uploading image:", error);
        return { error: "Failed to upload image" };
    }
}

// Function to handle meme upload
async function uploadMeme() {
    const imageInput = document.getElementById("meme-image");
    const captionInput = document.getElementById("meme-caption");
    const uploadStatus = document.getElementById("upload-status");

    const imageFile = imageInput.files[0];
    const caption = captionInput.value.trim();

    if (!imageFile || !caption) {
        uploadStatus.textContent = "Please select an image and enter a caption.";
        return;
    }

    uploadStatus.textContent = "Uploading meme...";

    try {
        const imgbbResponse = await uploadImageToImgBB(imageFile);
        console.log("ImgBB API Response:", imgbbResponse); // Debugging: Log the API response

        if (imgbbResponse.data) {
            const imageUrl = imgbbResponse.data.url;
            uploadStatus.innerHTML = `
                <p>Meme uploaded successfully!</p>
                <img src="${imageUrl}" alt="Uploaded Meme" style="max-width: 100%; border-radius: 10px; margin-top: 1rem;" />
                <p>Caption: ${caption}</p>
            `;
        } else {
            uploadStatus.textContent = "Failed to upload meme. Please try again.";
        }
    } catch (error) {
        console.error("Error uploading meme:", error);
        uploadStatus.textContent = "An error occurred. Please try again.";
    }
}

// Event listener for the Upload Meme button
document.getElementById("upload-meme-button").addEventListener("click", uploadMeme);

// Function to generate AI-based caption (placeholder)
function generateAICaption() {
    const captions = [
        "When you finally understand the meme...",
        "When the meme is too relatable...",
        "When you find the perfect meme template...",
        "When the meme hits differently...",
    ];
    return captions[Math.floor(Math.random() * captions.length)];
}


// Function to preview meme
function previewMeme() {
    const imageInput = document.getElementById("meme-image");
    const captionInput = document.getElementById("meme-caption");
    const previewImage = document.getElementById("preview-image");
    const previewCaption = document.getElementById("preview-caption");

    const imageFile = imageInput.files[0];
    const caption = captionInput.value.trim();

    console.log("Image file:", imageFile); // Debugging: Check if the file is selected
    console.log("Caption:", caption); // Debugging: Check if the caption is entered

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log("Image loaded:", e.target.result); // Debugging: Check if the image is loaded
            previewImage.src = e.target.result;
            previewImage.style.display = "block"; // Show the image
        };
        reader.readAsDataURL(imageFile); // Read the image file
    } else {
        console.log("No image file selected."); // Debugging: Check if no file is selected
        previewImage.style.display = "none"; // Hide the image if no file is selected
    }

    if (caption) {
        console.log("Caption entered:", caption); // Debugging: Check if the caption is entered
        previewCaption.textContent = caption; // Display the caption
    } else {
        console.log("No caption entered."); // Debugging: Check if no caption is entered
        previewCaption.textContent = ""; // Clear the caption if no text is entered
    }
}

// Add event listeners when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Event listener for the Preview button
    const previewButton = document.getElementById("preview-button");
    if (previewButton) {
        previewButton.addEventListener("click", previewMeme);
    }

    // Event listener for the meme image input
    const memeImageInput = document.getElementById("meme-image");
    if (memeImageInput) {
        memeImageInput.addEventListener("change", previewMeme);
    }

    // Event listener for the meme caption input
    const memeCaptionInput = document.getElementById("meme-caption");
    if (memeCaptionInput) {
        memeCaptionInput.addEventListener("input", previewMeme);
    }

    // Event listener for the Generate Caption button
document.getElementById("generate-caption-button").addEventListener("click", () => {
    const captionInput = document.getElementById("meme-caption");
    if (captionInput) {
        captionInput.value = generateAICaption(); // Generate and set the caption
        previewMeme(); // Update the preview
    }
});

    // Event listener for the Upload Meme button
    const uploadMemeButton = document.getElementById("upload-meme-button");
    if (uploadMemeButton) {
        uploadMemeButton.addEventListener("click", uploadMeme);
    }
});
//upload meme pg ends here---------------------------------------------------------------------------------------------------------------------

// Function to load meme details
function loadMemeDetails() {
    const memeId = new URLSearchParams(window.location.search).get("id");
    const memeTitle = document.getElementById("meme-title");
    const memeImage = document.getElementById("meme-image");
    const memeLikes = document.getElementById("meme-likes");
    const memeComments = document.getElementById("meme-comments");
    const commentsList = document.getElementById("comments-list");

    // Fetch meme details from local storage or API (placeholder)
    const meme = {
        id: memeId,
        title: "Funny Meme",
        imageUrl: "https://i.imgflip.com/1bij.jpg",
        likes: 120,
        comments: 5,
    };

    // Display meme details
    memeTitle.textContent = meme.title;
    memeImage.src = meme.imageUrl;
    memeLikes.textContent = meme.likes;
    memeComments.textContent = meme.comments;

    // Load comments from local storage
    const comments = JSON.parse(localStorage.getItem(`meme-${memeId}-comments`)) || [];
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <p>${comment}</p>
        </div>
    `).join("");

    // Handle like button click
    const likeButton = document.getElementById("like-button");
    const likeCount = document.getElementById("like-count");
    let likes = parseInt(localStorage.getItem(`meme-${memeId}-likes`)) || meme.likes;
    likeCount.textContent = likes;

    likeButton.addEventListener("click", () => {
        likes += 1;
        likeCount.textContent = likes;
        localStorage.setItem(`meme-${memeId}-likes`, likes.toString());
    });

    // Handle comment form submission
    const commentForm = document.getElementById("comment-form");
    const commentInput = document.getElementById("comment-input");

    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const comment = commentInput.value.trim();
        if (comment) {
            comments.push(comment);
            localStorage.setItem(`meme-${memeId}-comments`, JSON.stringify(comments));
            commentsList.innerHTML += `
                <div class="comment">
                    <p>${comment}</p>
                </div>
            `;
            commentInput.value = "";
            memeComments.textContent = comments.length;
        }
    });
}

// Call the function to load meme details when the page loads
window.onload = loadMemeDetails;

//meme details page ends here--------------------------------------------------------------------------------------------------------------------

// Function to load user profile
function loadUserProfile() {
    const profilePic = document.getElementById("profile-pic");
    const profilePicUpload = document.getElementById("profile-pic-upload");
    const profileName = document.getElementById("profile-name");
    const profileBio = document.getElementById("profile-bio");
    const saveProfileButton = document.getElementById("save-profile-button");
    const uploadedMemesContainer = document.getElementById("uploaded-memes-container");
    const likedMemesContainer = document.getElementById("liked-memes-container");

    // Load profile data from local storage
    const profileData = JSON.parse(localStorage.getItem("user-profile")) || {
        name: "",
        bio: "",
        profilePic: "https://via.placeholder.com/150",
        uploadedMemes: [],
        likedMemes: [],
    };

    // Display profile data
    profilePic.src = profileData.profilePic;
    profileName.value = profileData.name;
    profileBio.value = profileData.bio;

    // Handle profile picture upload
    profilePicUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePic.src = e.target.result;
                profileData.profilePic = e.target.result;
                localStorage.setItem("user-profile", JSON.stringify(profileData));
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle save profile button click
    saveProfileButton.addEventListener("click", () => {
        profileData.name = profileName.value;
        profileData.bio = profileBio.value;
        localStorage.setItem("user-profile", JSON.stringify(profileData));
        alert("Profile saved successfully!");
    });

    // Display uploaded memes
    profileData.uploadedMemes.forEach(meme => {
        const memeCard = document.createElement("div");
        memeCard.classList.add("meme-card");

        const memeImage = document.createElement("img");
        memeImage.src = meme.url;
        memeImage.alt = meme.name;

        memeCard.appendChild(memeImage);
        uploadedMemesContainer.appendChild(memeCard);
    });

    // Display liked memes
    profileData.likedMemes.forEach(meme => {
        const memeCard = document.createElement("div");
        memeCard.classList.add("meme-card");

        const memeImage = document.createElement("img");
        memeImage.src = meme.url;
        memeImage.alt = meme.name;

        memeCard.appendChild(memeImage);
        likedMemesContainer.appendChild(memeCard);
    });
}

// Function to save uploaded memes to Local Storage
function saveUploadedMeme(meme) {
    const profileData = JSON.parse(localStorage.getItem("user-profile"));
    if (profileData) {
        profileData.uploadedMemes.push(meme); // Add the meme to the uploaded memes array
        localStorage.setItem("user-profile", JSON.stringify(profileData));
    }
}

// Function to save liked memes to Local Storage
function saveLikedMeme(meme) {
    const profileData = JSON.parse(localStorage.getItem("user-profile"));
    if (profileData) {
        profileData.likedMemes.push(meme); // Add the meme to the liked memes array
        localStorage.setItem("user-profile", JSON.stringify(profileData));
    }
}

// Call the function to load user profile when the page loads
document.addEventListener("DOMContentLoaded", loadUserProfile);


// profile pg ends here----------------------------------------------------------------------------------------------------------------------------


// Function to load leaderboard data
function loadLeaderboard() {
    const topMemesContainer = document.getElementById("top-memes-container");
    const topUsersContainer = document.getElementById("top-users-container");

    // Fetch top memes and users from local storage or API (placeholder)
    const topMemes = [
        { id: 1, url: "https://i.imgflip.com/1bij.jpg", name: "Doge", likes: 120 },
        { id: 2, url: "https://i.imgflip.com/1bhw.jpg", name: "Grumpy Cat", likes: 95 },
        { id: 3, url: "https://i.imgflip.com/1bik.jpg", name: "Drake Hotline Bling", likes: 150 },
    ];

    const topUsers = [
        { id: 1, name: "User1", likes: 200, comments: 50, uploads: 10 },
        { id: 2, name: "User2", likes: 180, comments: 45, uploads: 8 },
        { id: 3, name: "User3", likes: 150, comments: 40, uploads: 7 },
    ];

    // Display top memes
    topMemes.forEach(meme => {
        const memeCard = document.createElement("div");
        memeCard.classList.add("leaderboard-card");

        const memeImage = document.createElement("img");
        memeImage.src = meme.url;
        memeImage.alt = meme.name;

        const memeName = document.createElement("h3");
        memeName.textContent = meme.name;

        const memeLikes = document.createElement("p");
        memeLikes.textContent = `Likes: ${meme.likes}`;

        memeCard.appendChild(memeImage);
        memeCard.appendChild(memeName);
        memeCard.appendChild(memeLikes);
        topMemesContainer.appendChild(memeCard);
    });

    // Display top users
    topUsers.forEach(user => {
        const userCard = document.createElement("div");
        userCard.classList.add("leaderboard-card");

        const userName = document.createElement("h3");
        userName.textContent = user.name;

        const userStats = document.createElement("p");
        userStats.textContent = `Likes: ${user.likes} | Comments: ${user.comments} | Uploads: ${user.uploads}`;

        userCard.appendChild(userName);
        userCard.appendChild(userStats);
        topUsersContainer.appendChild(userCard);
    });
}

// Call the function to load leaderboard data when the page loads
window.onload = loadLeaderboard;

//leaderboard pg ends here------------------------------------------------------------------------------------------------------------------------


