const memberContainer = document.querySelector("#member-container");
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");
const menuButton = document.querySelector("#menu");
const navigation = document.querySelector("#navigation");

async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load member data.");
        }

        const members = await response.json();

        displayMembers(members);

    } catch (error) {
        console.error("Error loading members:", error);

        memberContainer.innerHTML = `
            <p class="error-message">
                Sorry, the member directory could not be loaded.
            </p>
        `;
    }
}

function displayMembers(members) {

    memberContainer.innerHTML = "";

    members.forEach((member) => {

        const card = document.createElement("article");

        card.classList.add("member-card");

        const membershipName =
            member.membership === 3
                ? "Gold Member"
                : member.membership === 2
                    ? "Silver Member"
                    : "Member";

        card.innerHTML = `
            <img
                src="images/${member.image}"
                alt="${member.name} logo"
                width="200"
                height="120"
                loading="lazy">

            <div class="member-information">

                <h2>${member.name}</h2>

                <p>${member.description}</p>

                <p>
                    <strong>Address:</strong>
                    ${member.address}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${member.phone}
                </p>

                <p>
                    <strong>Membership:</strong>
                    ${membershipName}
                </p>

                <a
                    href="${member.website}"
                    target="_blank"
                    rel="noopener noreferrer">
                    Visit Website
                </a>

            </div>
        `;

        memberContainer.appendChild(card);
    });
}

gridButton.addEventListener("click", () => {

    memberContainer.classList.add("member-grid");
    memberContainer.classList.remove("member-list");

    gridButton.classList.add("active-view");
    listButton.classList.remove("active-view");

});

listButton.addEventListener("click", () => {

    memberContainer.classList.add("member-list");
    memberContainer.classList.remove("member-grid");

    listButton.classList.add("active-view");
    gridButton.classList.remove("active-view");

});

menuButton.addEventListener("click", () => {

    navigation.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    menuButton.setAttribute("aria-expanded", isOpen);

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

});

getMembers();
