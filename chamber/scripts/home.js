const menuButton = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");

const spotlightContainer =
    document.querySelector("#spotlight-container");

const temperature =
    document.querySelector("#temperature");

const weatherDescription =
    document.querySelector("#weather-description");

const forecastContainer =
    document.querySelector("#forecast");


/* =========================
   RESPONSIVE NAVIGATION
========================= */

menuButton.addEventListener("click", () => {

    navigation.classList.toggle("open");

    const isOpen =
        navigation.classList.contains("open");

    menuButton.setAttribute(
        "aria-expanded",
        isOpen
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

});


/* =========================
   WEATHER
========================= */

/*
   Replace this with your own
   OpenWeatherMap API key.
*/

const apiKey = "YOUR_API_KEY";

const city = "Abuja";

const currentWeatherURL =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

const forecastURL =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;


async function getWeather() {

    try {

        const currentResponse =
            await fetch(currentWeatherURL);

        if (!currentResponse.ok) {
            throw new Error("Unable to retrieve current weather.");
        }

        const currentData =
            await currentResponse.json();

        displayCurrentWeather(currentData);


        const forecastResponse =
            await fetch(forecastURL);

        if (!forecastResponse.ok) {
            throw new Error("Unable to retrieve forecast.");
        }

        const forecastData =
            await forecastResponse.json();

        displayForecast(forecastData);

    } catch (error) {

        console.error("Weather error:", error);

        weatherDescription.textContent =
            "Weather information is currently unavailable.";

        temperature.textContent = "--";

    }

}


function displayCurrentWeather(data) {

    temperature.textContent =
        Math.round(data.main.temp);

    weatherDescription.textContent =
        capitalizeWords(data.weather[0].description);

}


function displayForecast(data) {

    forecastContainer.innerHTML = "";

    /*
        OpenWeatherMap gives data in 3-hour intervals.

        We select one forecast for each of
        the next three days.
    */

    const selectedDays = [];

    for (const item of data.list) {

        const date =
            new Date(item.dt_txt);

        const day =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );

        if (!selectedDays.includes(day)) {

            selectedDays.push(day);

            if (selectedDays.length <= 3) {

                const forecastCard =
                    document.createElement("div");

                forecastCard.classList.add(
                    "forecast-card"
                );

                forecastCard.innerHTML = `
                    <h4>${day}</h4>

                    <p>
                        ${Math.round(item.main.temp)}°C
                    </p>

                    <p>
                        ${capitalizeWords(
                            item.weather[0].description
                        )}
                    </p>
                `;

                forecastContainer.appendChild(
                    forecastCard
                );
            }
        }

        if (selectedDays.length === 3) {
            break;
        }
    }

}


function capitalizeWords(text) {

    return text
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ");

}


/* =========================
   MEMBER SPOTLIGHTS
========================= */

async function getSpotlights() {

    try {

        const response =
            await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(
                "Unable to load member data."
            );
        }

        const members =
            await response.json();

        /*
            Only silver and gold members:
            2 = Silver
            3 = Gold
        */

        const qualifiedMembers =
            members.filter(
                member =>
                    member.membership === 2 ||
                    member.membership === 3
            );


        /*
            Randomize the members.
        */

        const randomized =
            qualifiedMembers.sort(
                () => Math.random() - 0.5
            );


        /*
            Select either two or three.
        */

        const numberToDisplay =
            Math.random() < 0.5 ? 2 : 3;

        const selectedMembers =
            randomized.slice(
                0,
                numberToDisplay
            );


        displaySpotlights(selectedMembers);

    } catch (error) {

        console.error(
            "Spotlight error:",
            error
        );

        spotlightContainer.innerHTML =
            "<p>Member spotlights are currently unavailable.</p>";

    }

}


function displaySpotlights(members) {

    spotlightContainer.innerHTML = "";

    members.forEach(member => {

        const card =
            document.createElement("article");

        card.classList.add("spotlight-card");

        const membershipName =
            member.membership === 3
                ? "Gold Member"
                : "Silver Member";

        card.innerHTML = `

            <img
                src="images/${member.image}"
                alt="${member.name} logo"
                width="180"
                height="100"
                loading="lazy">

            <h3>
                ${member.name}
            </h3>

            <p>
                ${member.address}
            </p>

            <p>
                ${member.phone}
            </p>

            <p>
                <strong>
                    ${membershipName}
                </strong>
            </p>

            <a
                href="${member.website}"
                target="_blank"
                rel="noopener noreferrer">
                Visit Website
            </a>

        `;

        spotlightContainer.appendChild(card);

    });

}


/* =========================
   RUN FUNCTIONS
========================= */

getWeather();

getSpotlights();
