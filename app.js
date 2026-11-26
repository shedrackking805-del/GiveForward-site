const seed = [
  {
    id: 1,
    title: "Help provide school supplies for local children",
    category: "Education",
    raised: 7200,
    goal: 10000,
    donors: 84,
    story:
      "We are raising funds to provide essential school supplies and learning materials to children in our community. Every contribution helps give a child the tools they need to learn."
  },

  {
    id: 2,
    title: "Emergency support for a family rebuilding",
    category: "Emergency",
    raised: 4850,
    goal: 8000,
    donors: 61,
    story:
      "After an unexpected emergency, this family needs help covering immediate living expenses while they get back on their feet. Thank you for helping them through this difficult period."
  },

  {
    id: 3,
    title: "Community project to improve our neighborhood",
    category: "Community",
    raised: 3150,
    goal: 5000,
    donors: 43,
    story:
      "Our community is coming together to improve a shared space and create a safer, more welcoming environment for everyone. Your support can help us reach the finish line."
  }
];


let campaigns =
  JSON.parse(
    localStorage.getItem("giveforward_campaigns") || "null"
  ) || seed;


function save() {

  localStorage.setItem(
    "giveforward_campaigns",
    JSON.stringify(campaigns)
  );

}


function fmt(number) {

  return "$" +
    Number(number).toLocaleString("en-US");

}


function card(c) {

  const percentage =
    Math.min(
      100,
      (Number(c.raised) / Number(c.goal)) * 100
    );


  return `
    <article class="card">

      <a href="campaign.html?id=${encodeURIComponent(c.id)}">

        <div class="thumb">
          ${c.category || "Fundraiser"}
        </div>

      </a>


      <div class="card-body">

        <div class="kicker">
          ${c.category || "Fundraiser"}
        </div>


        <h3>

          <a href="campaign.html?id=${encodeURIComponent(c.id)}">
            ${c.title}
          </a>

        </h3>


        <div class="bar">

          <i style="width:${percentage}%"></i>

        </div>


        <p>
          <b>${fmt(c.raised)}</b>
          raised of ${fmt(c.goal)}
        </p>


        <p class="muted-text">
          ${c.donors || 0} people have donated
        </p>

      </div>

    </article>
  `;

}


function render(list = campaigns) {

  const element =
    document.getElementById("campaigns");

  if (!element) return;


  element.innerHTML =
    list.length
      ? list.map(card).join("")
      : "<p>No fundraisers found.</p>";

}


function setText(id, text) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = text;
  }

}


function loadCampaign(id) {

  const campaign =
    campaigns.find(
      c =>
        String(c.id) === String(id)
    );


  if (!campaign) {

    setText(
      "title",
      "Fundraiser not found"
    );

    setText(
      "story",
      "This fundraiser could not be found."
    );

    return;

  }


  document.title =
    campaign.title +
    " — GiveForward";


  setText(
    "title",
    campaign.title
  );


  setText(
    "category",
    campaign.category
  );


  setText(
    "story",
    campaign.story
  );


  setText(
    "raised",
    fmt(campaign.raised)
  );


  setText(
    "goal",
    " raised of " +
    fmt(campaign.goal)
  );


  setText(
    "donors",
    (campaign.donors || 0) +
    " people have donated"
  );


  const percentage =
    Math.min(
      100,
      (Number(campaign.raised) /
        Number(campaign.goal)) *
        100
    );


  const progress =
    document.getElementById("progress");


  if (progress) {

    progress.style.width =
      percentage + "%";

  }


  if (campaign.image) {

    const image =
      document.getElementById(
        "campaign-image"
      );


    if (image) {

      image.style.backgroundImage =
        `url("${campaign.image}")`;

      image.textContent = "";

    }

  }

}


let selected = 25;


function openDonate() {

  const modal =
    document.getElementById("modal");

  if (modal) {

    modal.classList.add("open");

  }

}


function closeDonate() {

  const modal =
    document.getElementById("modal");

  if (modal) {

    modal.classList.remove("open");

  }

}


function pick(amount) {

  selected = amount;


  const custom =
    document.getElementById("custom");


  if (custom) {

    custom.value =
      amount;

  }

}


function share() {

  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {

      alert("Campaign link copied!");

    })
    .catch(() => {

      alert(
        "Copy the page URL to share this fundraiser."
      );

    });

}


document.addEventListener(
  "DOMContentLoaded",
  () => {

    render();


    const search =
      document.getElementById("search");


    if (search) {

      search.addEventListener(
        "input",
        () => {

          const query =
            search.value
              .toLowerCase();


          render(
            campaigns.filter(
              campaign =>
                (
                  campaign.title +
                  " " +
                  campaign.category +
                  " " +
                  campaign.story
                )
                  .toLowerCase()
                  .includes(query)
            )
          );

        }
      );

    }


    const form =
      document.getElementById("form");


    if (form) {

      form.addEventListener(
        "submit",
        event => {

          event.preventDefault();


          const data =
            new FormData(form);


          const campaign = {

            id: Date.now(),

            title:
              data.get("title"),

            category:
              data.get("category"),

            raised: 0,

            goal:
              Number(
                data.get("goal")
              ),

            donors: 0,

            story:
              data.get("story"),

            image:
              data.get("image")

          };


          campaigns.unshift(
            campaign
          );


          save();


          window.location.href =
            "campaign.html?id=" +
            encodeURIComponent(
              campaign.id
            );

        }
      );

    }


    const id =
      new URLSearchParams(
        window.location.search
      ).get("id");


    if (id) {

      loadCampaign(id);

    }

  }
);
