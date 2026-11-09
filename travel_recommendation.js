const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsContainer = document.getElementById("results");
const bookNowBtn = document.getElementById("bookNowBtn");

let travelData = null;

// Fetch travel recommendation data
async function fetchTravelData() {
  try {
    const response = await fetch("./travel_recommendation_api.json");

    if (!response.ok) {
      throw new Error("Faild to fetch travel data");
    }

    travelData = await response.json();

    console.log("travel data loaded:", travelData);
  } catch (error) {
    console.error("Error fetching data: " + error);
    resultsContainer.innerHTML =
      "<p>Unable to load travel data. Please try again.</p>";
  }
}

// Convert country data into recommendation cards

function getCountryRecommendations() {
  return travelData.countries.map((country) => ({
    name: country.name,
    imageUrl: country.cities[0].imageUrl,
    description: country.cities[0].description,
    category: "Country",
  }));
}

// Search recommendations

async function searchRecommendations() {
  const keyword = searchInput.value.trim().toLowerCase();

  if (!keyword) {
    resultsContainer.innerHTML = "<p>Please enter a search keyword.</p>";
    return;
  }

  if (!travelData) {
    await fetchTravelData();
  }

  if (!travelData) {
    return;
  }

  let recommendations = [];

  // Beach search

  if (["beach", "beaches"].includes(keyword)) {
    recommendations = travelData.beaches.map((item) => ({
      ...item,
      category: "Beach",
    }));
  }

  // country search
  else if (["country", "countries"].includes(keyword)) {
    travelData.temples.map((item) => ({ ...item, category: "Temple" }));
  } else if (["temple", "temples"].includes(keyword)) {
    recommendations = getCountryRecommendations();
  }

  // Search by destination name or description
  else {
    const allRecommendations = [
      ...travelData.beaches.map((item) => ({
        ...item,
        category: "Beach",
      })),
      ...travelData.temples.map((item) => ({ ...item, category: "Temple" })),
      ...travelData.countries.flatMap((country) =>
        country.cities.map((city) => ({ ...city, category: "City" })),
      ),
    ];

    recommendations = allRecommendations.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword),
    );
  }

  displayRecommendations(recommendations);
}

// Display recommendation cards
function displayRecommendations(recommendations) {
  resultsContainer.innerHTML = "";

  if (recommendations.length === 0) {
    resultsContainer.innerHTML =
      "<p> No recommendation found. Try another keyword. </p>";

    return;
  }

  recommendations.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("result-card");

    card.innerHTML = `
    <img src="${item.imageUrl}" alt="${item.name}" />
    <div class="card-content">
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <span>${item.category || ""}
    </div>
    `;
    resultsContainer.appendChild(card);
  });
}

// Clear search results
function clearSearch() {
  searchInput.value = "";
  resultsContainer.innerHTML = "";
}

// Event listeners
searchBtn.addEventListener("click", searchRecommendations);
clearBtn.addEventListener("click", clearSearch);

// Search using Enter key
searchInput.addEventListener("keydown", (event) => {
  console.log(event.key);
  if (event.key === "Enter") {
    searchRecommendations();
  }
});

// Book Now button
bookNowBtn.addEventListener("click", () => {
  alert("Thank you for your interest! Happy travelling.");
});

// Load JSON when the page is opens
