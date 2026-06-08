const STORAGE_KEY = "secret-agent-leaks";
const VOTE_KEY = "secret-agent-votes";
const EVIDENCE_KEY = "secret-agent-extra-evidence";



const tapes = [
  "images/tape-1.png",
  "images/tape-2.png",
  "images/tape-3.png",
  "images/tape-4.png",
  "images/tape-5.png",
  "images/tape-6.png"
];

const suspects = [
  { name: "Angelo", image: "images/Angelo.png" },
  { name: "Thijs", image: "images/Thijs.png" },
  { name: "Emlynne", image: "images/Emlynne.png" },
  { name: "Giel", image: "images/Giel.png" },
  { name: "Guus", image: "images/Guus.png" },
  { name: "Lars", image: "images/Lars.png" },
  { name: "Maud", image: "images/Maud.png" },
  { name: "Myrthe", image: "images/Myrthe.png" },
  { name: "Victor", image: "images/Victor.png" },
  { name: "Liz", image: "images/Liz.png" },
  { name: "Dario", image: "images/Dario.png" },
  { name: "Diederik", image: "images/Diederik.png" },
  { name: "Timo", image: "images/Timo.png" },
  { name: "Vincent", image: "images/Vincent.png" },
  { name: "Mike", image: "images/Mike.png" },
  { name: "Tessa", image: "images/Tessa.png" },
  { name: "Dito", image: "images/Dito.png" },
  { name: "Minkoo", image: "images/Minoo.png" },
  { name: "Chris", image: "images/Chris.png" },
  { name: "Kevin", image: "images/Kevin.png" },
  { name: "Silvia", image: "images/Silvia.png" },
  { name: "Art", image: "images/Art.png" },
  { name: "Theresa", image: "images/Theresa.png" },
  { name: "Nick", image: "images/Nick.png" },
  { name: "Roderick", image: "images/Roderick.png" },
  { name: "Amin", image: "images/Amin.png" }
].sort((a, b) => a.name.localeCompare(b.name));

const leaks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const votes = JSON.parse(localStorage.getItem(VOTE_KEY) || "{}");

const extraEvidence = JSON.parse(localStorage.getItem(EVIDENCE_KEY) || "{}");

function saveExtraEvidence(nextEvidence) {
  localStorage.setItem(EVIDENCE_KEY, JSON.stringify(nextEvidence));
}

function saveLeaks(nextLeaks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLeaks));
}

function saveVotes(nextVotes) {
  localStorage.setItem(VOTE_KEY, JSON.stringify(nextVotes));
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  }).replaceAll("/", "-");
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function resizeImage(file, maxWidth, callback) {
  const reader = new FileReader();
  const img = new Image();

  reader.onload = e => {
    img.src = e.target.result;
  };

  img.onload = () => {
    const scale = Math.min(1, maxWidth / img.width);
    const canvas = document.createElement("canvas");
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    callback(canvas.toDataURL("image/jpeg", 0.72));
  };

  reader.readAsDataURL(file);
}

// function renderBottomBar() {
//   const bar = document.getElementById("profileBar");
//   if (!bar) return;

//   bar.innerHTML = "";

//   suspects.forEach(name => {
//     const item = document.createElement("div");
//     item.className = "profile-item";
//     item.innerHTML = `
//       <div class="profile-img">${name.charAt(0)}</div>
//       <p>${name}</p>
//     `;
//     bar.appendChild(item);
//   });
// }

/*Footer*/
function renderBottomBar() {
  const bar = document.getElementById("profileBar");
  if (!bar) return;

  bar.innerHTML = "";

  suspects.forEach(person => {
    const item = document.createElement("div");
    item.className = "profile-item";

    item.innerHTML = `
      <img
        class="profile-img"
        src="${person.image}"
        alt="${person.name}"
      >
      <p>${person.name}</p>
    `;

    bar.appendChild(item);
  });
}

/* Agent/non-agent: NEW LEAK knop tonen of verbergen */
const newLeakBtn = document.getElementById("newLeakBtn");
if (newLeakBtn && localStorage.getItem("isAgent") !== "true") {
  newLeakBtn.style.display = "none";
}

/* New Leak formulier */
const form = document.getElementById("leakForm");
const slachtofferSelect = document.getElementById("slachtoffer");
const photoInput = document.getElementById("photo");
const fileLabel = document.getElementById("fileLabel");

// if (slachtofferSelect) {
//   suspects.forEach(name => {
//     const option = document.createElement("option");
//     option.value = name;
//     option.textContent = name;
//     slachtofferSelect.appendChild(option);
//   });
// }
// suspects.forEach(person => {
//   const option = document.createElement("option");
//   option.value = person.name;
//   option.textContent = person.name;
//   slachtofferSelect.appendChild(option);
// });

if (slachtofferSelect) {
  suspects.forEach(person => {
    const option = document.createElement("option");
    option.value = person.name;
    option.textContent = person.name;
    slachtofferSelect.appendChild(option);
  });
}

if (photoInput && fileLabel) {
  photoInput.addEventListener("change", () => {
    fileLabel.textContent = photoInput.files.length ? photoInput.files[0].name : "Click or drag file here";
  });
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const slachtoffer = document.getElementById("slachtoffer").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const photo = document.getElementById("photo");

    if (!slachtoffer || !description || !date) {
      alert("Vul alle velden in.");
      return;
    }

    if (!photo.files.length) {
      alert("Selecteer een foto.");
      return;
    }

    resizeImage(photo.files[0], 900, resizedImage => {
      const nextLeaks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      // nextLeaks.push({
      //   id: makeId(),
      //   slachtoffer,
      //   description,
      //   date,
      //   image: resizedImage,
      //   createdAt: Date.now()
      // });

      const randomTape =
          tapes[Math.floor(Math.random() * tapes.length)];

        nextLeaks.push({
          id: makeId(),
          slachtoffer,
          description,
          date,
          image: resizedImage,
          tape: randomTape,
          createdAt: Date.now()
        });

      try {
        saveLeaks(nextLeaks);
        window.location.href = "are-you-safe.html";
      } catch (err) {
        alert("Opslag is vol. Verwijder eerst data met reset.");
        console.error(err);
      }
    });
  });
}

/* Are You Safe timeline */
const timeline = document.getElementById("timeline");

if (timeline) {
  const sorted = [...leaks].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (!sorted.length) {
    timeline.innerHTML = `<p class="empty-state">Nog geen leaks toegevoegd.</p>`;
  }

  sorted.forEach((leak, index) => {
    const entry = document.createElement("article");
    entry.className = `safe-leak ${index % 2 === 1 ? "safe-leak-alt" : ""}`;

    entry.innerHTML = `
<div class="leak-image-wrap">

  <img
    class="photo-tape"
    src="${leak.tape || tapes[index % tapes.length]}"
    alt=""
  >
  <span class="date-tape">
    ${formatDate(leak.date)}
  </span>

  <img
    class="leak-photo"
    src="${leak.image}"
    alt="${leak.slachtoffer}"
  >

</div>

      <div class="leak-note">
        <strong>${leak.slachtoffer}</strong>
        <p>${leak.description}</p>
      </div>
    `;

    timeline.appendChild(entry);
  });
}

/* Are You Safe ranking: boven veilig/laag, onder rood voor meeste leaks */
const ranking = document.getElementById("rankingList");
const bottomRanking = document.getElementById("bottomRanking");

if (ranking && bottomRanking) {
  const counts = {};
  leaks.forEach(leak => {
    counts[leak.slachtoffer] = (counts[leak.slachtoffer] || 0) + 1;
  });

  // const safePeople = suspects
  //   .filter(name => !counts[name])
  //   .sort((a, b) => a.localeCompare(b));
const safePeople = suspects
  .map(person => person.name)
  .filter(name => !counts[name])
  .sort((a, b) => a.localeCompare(b));


  // const spottedPeople = suspects
  //   .filter(name => counts[name])
  //   .map(name => ({ name, count: counts[name] }))
  //   .sort((a, b) => a.count - b.count || a.name.localeCompare(b.name));
  const spottedPeople = suspects
  .map(person => person.name)
  .filter(name => counts[name])
  .map(name => ({ name, count: counts[name] }))
  .sort((a, b) => a.count - b.count || a.name.localeCompare(b.name));

  const topItems = safePeople.slice(0, 5);
  const bottomItems = spottedPeople.slice(-5);

  ranking.innerHTML = topItems.length
    ? topItems.map((name, i) => `<p>${i + 1}. ${name}</p>`).join("")
    : `<p>Iedereen is al gesnopen.</p>`;

  bottomRanking.innerHTML = bottomItems.length
    ? bottomItems.map((person, i) => {
        const number = safePeople.length + spottedPeople.indexOf(person) + 1;
        return `<p>${number}. ${person.name}</p>`;
      }).join("")
    : `<p>Nog niemand.</p>`;
}

/*Hint systeem*/
function getSkippedLeakCount(leaks) {
  const uniqueDates = [...new Set(
    leaks
      .map(leak => leak.date)
      .filter(Boolean)
  )].sort();

  let skippedCount = 0;

  for (let i = 1; i < uniqueDates.length; i++) {
    const previousDate = new Date(uniqueDates[i - 1]);
    const currentDate = new Date(uniqueDates[i]);

    const differenceInDays =
      (currentDate - previousDate) / (1000 * 60 * 60 * 24);

    if (differenceInDays > 1) {
      skippedCount += differenceInDays - 1;
    }
  }

  return skippedCount;
}
/*voer hier de hints die je van de agents uit de informatie kaart hebt gehaald in*/
const hints = [
  "Hint 01: bla bla bla.",
  "Hint 02: bla bla bla.",
  "Hint 03: bla bla bla.",
  "Hint 04: bla bla bla."
];
/* Who Are They */
/* Who Are They */
const whoContainer = document.getElementById("whoContainer");
const voteRanking = document.getElementById("voteRanking");
const hintText = document.getElementById("hintText");

let activeLeakId = null;
let selectedPersonIndex = 0;

function getTopVotedPersonForLeak(leakId) {
  const leakVotes = votes[leakId] || {};
  const entries = Object.entries(leakVotes).sort((a, b) => b[1] - a[1]);

  if (!entries.length) return suspects[0];

  const topName = entries[0][0];
  return suspects.find(person => person.name === topName) || suspects[0];
}

function updateVoteModalPerson() {
  const person = suspects[selectedPersonIndex];

  document.getElementById("votePersonImage").src = person.image;
  document.getElementById("votePersonImage").alt = person.name;
  document.getElementById("votePersonName").textContent = person.name;
}

if (hintText) {
  const skippedCount = getSkippedLeakCount(leaks);

  hintText.textContent =
    skippedCount > 0
      ? hints[Math.min(skippedCount - 1, hints.length - 1)]
      : "No hint available yet.";
}

if (whoContainer) {
  const sorted = [...leaks].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (!sorted.length) {
    whoContainer.innerHTML = `<p class="empty-state dark-text">Nog geen leaks toegevoegd.</p>`;
  }

  sorted.forEach((leak, index) => {
    const card = document.createElement("article");
    card.className = `who-card ${index % 2 === 1 ? "reverse" : ""}`;

    const topPerson = getTopVotedPersonForLeak(leak.id);

    card.innerHTML = `
      <div class="who-photo" data-image="${leak.image}">
        <img
          class="photo-tape who-photo-tape"
          src="${leak.tape || tapes[index % tapes.length]}"
          alt=""
        >

        <span class="name-tape">${leak.slachtoffer}</span>

        <img
          class="who-main-photo"
          src="${leak.image}"
          alt="${leak.slachtoffer}"
        >

        <button type="button" class="zoom-btn">⊕</button>
      </div>

      <div class="vote-panel">
        <img
          class="vote-preview-img"
          src="${topPerson.image}"
          alt="${topPerson.name}"
        >
        <p>${topPerson.name}</p>
        <button type="button" class="vote-btn" data-leak-id="${leak.id}">VOTE</button>
      </div>

      <div class="evidence-box">
        <button type="button" class="add-evidence-btn" data-leak-id="${leak.id}">+</button>
        <strong>Evidence</strong>
        <p>${leak.description}</p>

        <div class="extra-evidence-list">
          ${(extraEvidence[leak.id] || []).map(item => `
            <div class="extra-evidence-item">
              ${item.image ? `<img src="${item.image}" alt="">` : ""}
              <p>${item.text}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    whoContainer.appendChild(card);
  });
}

/* Vote modal */
const voteModal = document.getElementById("voteModal");
const voteClose = document.getElementById("voteClose");
const prevVotePerson = document.getElementById("prevVotePerson");
const nextVotePerson = document.getElementById("nextVotePerson");
const confirmVote = document.getElementById("confirmVote");

document.querySelectorAll(".vote-btn").forEach(button => {
  button.addEventListener("click", () => {
    activeLeakId = button.dataset.leakId;
    selectedPersonIndex = 0;

    updateVoteModalPerson();
    voteModal.classList.remove("hidden");
  });
});

if (prevVotePerson) {
  prevVotePerson.addEventListener("click", () => {
    selectedPersonIndex =
      selectedPersonIndex === 0 ? suspects.length - 1 : selectedPersonIndex - 1;

    updateVoteModalPerson();
  });
}

if (nextVotePerson) {
  nextVotePerson.addEventListener("click", () => {
    selectedPersonIndex =
      selectedPersonIndex === suspects.length - 1 ? 0 : selectedPersonIndex + 1;

    updateVoteModalPerson();
  });
}

if (confirmVote) {
  confirmVote.addEventListener("click", () => {
    if (!activeLeakId) return;

    const selectedPerson = suspects[selectedPersonIndex];

    if (!votes[activeLeakId]) {
      votes[activeLeakId] = {};
    }

    votes[activeLeakId][selectedPerson.name] =
      (votes[activeLeakId][selectedPerson.name] || 0) + 1;

    saveVotes(votes);
    location.reload();
  });
}

if (voteClose) {
  voteClose.addEventListener("click", () => {
    voteModal.classList.add("hidden");
  });
}

/* Image modal */
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.querySelector("#imageModal .modal-close");

document.querySelectorAll(".who-photo").forEach(photo => {
  photo.addEventListener("click", () => {
    if (!modal || !modalImage) return;
    modalImage.src = photo.dataset.image;
    modal.classList.remove("hidden");
  });
});

if (modalClose) {
  modalClose.addEventListener("click", () => modal.classList.add("hidden"));
}



/* Reset kan op elke pagina werken als je later een knop toevoegt */
const resetBtn = document.getElementById("resetData");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (confirm("Weet je zeker dat je ALLE data wilt verwijderen?")) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VOTE_KEY);
      location.reload();
    }
  });
}

renderBottomBar();


/*evidence*/
let activeEvidenceLeakId = null;

const evidenceModal = document.getElementById("evidenceModal");
const evidenceClose = document.getElementById("evidenceClose");
const evidenceText = document.getElementById("evidenceText");
const evidenceImage = document.getElementById("evidenceImage");
const saveEvidence = document.getElementById("saveEvidence");

document.querySelectorAll(".add-evidence-btn").forEach(button => {
  button.addEventListener("click", () => {
    activeEvidenceLeakId = button.dataset.leakId;

    evidenceText.value = "";
    evidenceImage.value = "";

    evidenceModal.classList.remove("hidden");
  });
});

if (saveEvidence) {
  saveEvidence.addEventListener("click", () => {
    if (!activeEvidenceLeakId) return;

    const text = evidenceText.value.trim();
    const file = evidenceImage.files[0];

    if (!text && !file) {
      alert("Add text or upload an image.");
      return;
    }

    const saveItem = imageData => {
      if (!extraEvidence[activeEvidenceLeakId]) {
        extraEvidence[activeEvidenceLeakId] = [];
      }

      extraEvidence[activeEvidenceLeakId].push({
        text,
        image: imageData || ""
      });

      saveExtraEvidence(extraEvidence);
      location.reload();
    };

    if (file) {
      resizeImage(file, 600, resizedImage => {
        saveItem(resizedImage);
      });
    } else {
      saveItem("");
    }
  });
}

if (evidenceClose) {
  evidenceClose.addEventListener("click", () => {
    evidenceModal.classList.add("hidden");
  });
}


/*Informatie knop */
const infoBtn = document.getElementById("infoBtn");
const infoModal = document.getElementById("infoModal");
const infoClose = document.getElementById("infoClose");
const infoContent = document.getElementById("infoContent");
const infoCard = document.querySelector(".info-card");

const agentInfo = `
  <h2>AGENT<br>INFORMATION</h2>

  <h3>MISSION BRIEFING</h3>
  <p>Welcome, Secret Agent.</p>
  <p>You have been selected to participate in Operation Secret Agent. For the next two weeks, your mission is to identify and document unsafe digital behaviour within the workspace while remaining completely anonymous.</p>
  <p>Your identity must remain secret until the end of the experiment.</p>

  <h3>YOUR MISSION</h3>
  <p>Mission Objectives</p>
  <ul>
    <li>Observe digital behaviour.</li>
    <li>Identify security risks.</li>
    <li>Collect evidence.</li>
    <li>Upload leaks to the website.</li>
    <li>Remain anonymous.</li>
  </ul>

  <h3>SUBMIT A LEAK</h3>
  <p>When you discover a digital security risk, document it and submit it to the investigation.</p>
  <ol>
    <li>Open New Leak.</li>
    <li>Enter the target’s first name.</li>
    <li>Select the potential risk associated with the exposed information.</li>
    <li>Enter the date of collection.</li>
    <li>Upload photographic evidence.</li>
    <li>Press Add Leak to publish the report.</li>
  </ol>

  <p>Once submitted, the leak will appear on the investigation pages and become part of the evidence available to all participants.</p>

  <h3>RULES OF ENGAGEMENT</h3>
    <ol>
      <li>No hacking or unauthorized access.</li>
      <li>Do not access private accounts.</li>
      <li>Do not share collected data outside the experiment.</li>
      <li>Do not capture identifiable faces in photographs.</li>
      <li>Do not cause harm, digitally or socially.</li>
      <li>Remain completely anonymous.</li>
      <li>You decide when and where to strike.</li>
    </ol>
  <h3>WORKING TOGETHER</h3>
  <p>You may <strong>not be the only Secret Agent operating</strong> during the experiment. Collaborate with fellow agents to uncover digital security risks, exchange ideas, and maintain a steady flow of new evidence on the website.</p>
  <p>Avoid posting the same leak twice and always protect the anonymity of your fellow agents.</p>

  <h3>TOOLKIT</h3>
  <p>Use your creativity to uncover examples of unsafe digital behaviour. Some agents may develop their own methods during the experiment. If you discover an effective tactic, leave it behind for future Secret Agents.</p>

 <p><strong>Ideas to Get Started:</strong></p>
  <ol>
    <li>Walk through the workspace and observe your surroundings.</li>
    <li>Look for information that is unintentionally visible.</li>
    <li>Work together with other agents to create opportunities for observation.</li>
    <li>Capture evidence discreetly and respectfully.</li>
    <li>Create and send your own phishing email to test awareness.</li>
    <li>Think like an attacker and consider what information could be valuable.</li>
    <li>Share successful approaches with future Secret Agents.</li>
  </ol>

  <p><strong>Remember:</strong> focus on awareness, not embarrassment. The goal is to reveal risks and encourage safer behaviour.</p>
`;

const notAgentInfo = `
  <h2>NOT AGENT<br>INFORMATION</h2>

  <h3>YOU ARE NOT THE SECRET AGENT</h3>

  <p>
    Over the next two weeks, we will be running an experiment called Secret Agent.
    The goal of this experiment is to raise awareness of unsafe digital behaviour
    in our shared workspace.
  </p>

  <h3>WHAT DOES THIS MEAN FOR YOU</h3>

  <p>
    During this period, one or more Secret Agents will be active. Their identity
    will remain secret until the end of the experiment. The Secret Agent observes
    visible digital behaviour in the space. Situations in which information is
    unintentionally visible or accessible may be documented and shared anonymously
    on the website.
  </p>
<br>
  <p>
    As a participant, you can investigate the collected evidence on the
    <strong>Who Are They?</strong> page. Here you can view reported situations,
    examine the details, discuss possible suspects, and share your own theories
    about who the Secret Agent might be.
  </p>
<br>
  <p>
    Throughout the experiment, participants can <strong>vote</strong> for the
    person they believe is the Secret Agent. These votes remain visible on the
    website and may change over time as new evidence appears.
  </p>
<br>
  <p>
    To keep the investigation moving, a <strong>hint</strong> will automatically
    appear on the website whenever no new evidence has been posted for a full day.
    These hints are designed to help participants narrow down potential suspects
    and encourage further discussion and investigation.
  </p>
<h3>THE ENDING OF THE GAME</h3>
  <p>
    At the end of the <strong>two-week period</strong>, an official
    <strong>final vote</strong> will take place. Once all final votes have been
    submitted, the Secret Agent will be revealed. The participant who correctly
    identifies the Secret Agent will receive a
    <strong>Secret Agent Coin</strong>.
  </p>
<br>
  <p>
    <strong>Together</strong>, we will then reflect on how the Secret Agent
    operated and discuss the three most significant digital security risks
    observed during the experiment. We will explore why these situations
    occurred and how they could have been prevented.
  </p>
`;

if (infoBtn && infoModal && infoContent && infoCard) {
  infoBtn.addEventListener("click", () => {
    const isAgent = localStorage.getItem("isAgent") === "true";

    infoCard.classList.toggle("not-agent", !isAgent);
    infoContent.innerHTML = isAgent ? agentInfo : notAgentInfo;

    infoModal.classList.remove("hidden");
  });
}

if (infoClose && infoModal) {
  infoClose.addEventListener("click", () => {
    infoModal.classList.add("hidden");
  });
}