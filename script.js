// Fetches Pokemon data using two API calls
async function getPokemonData(pokemonId) {
  try {
    // First API call: basic Pokemon details
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemonData = await pokemonRes.json();

    // Second API call: species specific data
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const speciesData = await speciesRes.json();

    // Fields from both endpoints
    const name = pokemonData.name;
    const sprite = pokemonData.sprites.front_default;
    const height = pokemonData.height;
    const weight = pokemonData.weight;
    const types = pokemonData.types.map(t => t.type.name);
    const flavorEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
    const flavor_text = flavorEntry ? flavorEntry.flavor_text.replace(/\f|\n/g, ' ') : "No flavor text available.";
    const habitat = speciesData.habitat ? speciesData.habitat.name : "unknown";
    const isLegendary = speciesData.is_legendary;

    const finalData = {
      name,
      sprite,
      height,
      weight,
      types,
      flavor_text,
      habitat,
      isLegendary
    };

    // Log the formatted object to the console
    // console.log({
    //   name: finalData.name,
    //   height: finalData.height,
    //   weight: finalData.weight,
    //   types: finalData.types,
    //   flavor_text: finalData.flavor_text,
    //   habitat: finalData.habitat,
    //   isLegendary: finalData.isLegendary
    // });

    return finalData;

  } catch (error) {
    console.error("Error fetching Pokemon data, call Prof. Oak!:", error);
    return null;
  }
}

// Renders the Pokemon card and injects content dynamically
async function assignmentTask() {
  const randomId = Math.floor(Math.random() * 151) + 1;
  const data = await getPokemonData(randomId);
  if (!data) return;

  const card = document.getElementById("pokemon-card");
  card.innerHTML = ""; 

  // Image 
  const img = document.createElement("img");
  img.src = data.sprite;
  img.alt = data.name;
  img.className = "poke-image"; 
  img.style.opacity = "0";
  card.appendChild(img);

  // Animate after it's loaded
  img.onload = () => {
    img.classList.add("animate-in");
  };

  // Name
  const name = document.createElement("h2");
  name.textContent = data.name;
  card.appendChild(name);

  // Height and Weight
  const stats = document.createElement("p");
  stats.innerHTML = `<strong>Height:</strong> ${data.height} | <strong>Weight:</strong> ${data.weight}`;
  card.appendChild(stats);

  // Habitat
  const habitat = document.createElement("p");
  habitat.innerHTML = `<strong>Habitat:</strong> ${data.habitat}`;
  card.appendChild(habitat);

  // Types list
  const typeList = document.createElement("ul");
  typeList.className = "types";
  data.types.forEach(type => {
    const li = document.createElement("li");
    li.className = "type-badge";
    li.textContent = type;
    typeList.appendChild(li);
  });
  card.appendChild(typeList);

  // Legendary label
  if (data.isLegendary) {
    const legend = document.createElement("p");
    legend.className = "legendary";
    legend.textContent = "Legendary Pokémon";
    card.appendChild(legend);
  }

  // Flavor text
  const flavor = document.createElement("p");
  flavor.className = "flavor";
  flavor.textContent = `"${data.flavor_text}"`;
  card.appendChild(flavor);

  // Refresh button
  const button = document.createElement("button");
  button.id = "refresh-btn";
  button.textContent = "Refresh Pokémon";
  button.addEventListener("click", assignmentTask);
  card.appendChild(button);
}

// Initial load
assignmentTask();
