const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".btn");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currcode in countryList) {
    let newoption = document.createElement("option");
    newoption.innerText = currcode;
    newoption.value = currcode;

    if (select.name === "from" && currcode === "USD") {
      newoption.selected = true;
    } else if (select.name === "to" && currcode === "INR") {
      newoption.selected = true;
    }

    select.append(newoption);
  }

  select.addEventListener("change", (evt) => {
    updateflag(evt.target);
  });
}

// Update country flag when currency changes
const updateflag = (element) => {
  let currcode = element.value;
  let countrycode = countryList[currcode];
  let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newsrc;
};

// Fetch exchange rate on button click
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amountInput = document.querySelector(".amount input");
  let amtval = parseFloat(amountInput.value);

  if (isNaN(amtval) || amtval < 1) {
    amtval = 1;
    amountInput.value = "1";
  }

  const from = fromcurr.value.toLowerCase();
  const to = tocurr.value.toLowerCase();
  const URL = `${BASE_URL}/${from}.json`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    let rate = data[from][to];
    let finalamount = (amtval * rate).toFixed(2);

    msg.innerText = `${amtval} ${fromcurr.value} = ${finalamount} ${tocurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error("Fetch error:", error);
  }
});
