// Search meal by name
// https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
const formInput = document.getElementById("form-input"),
  searchvalue = document.getElementById("search"),
  randombtn = document.getElementById("random"),
  result_heading = document.getElementById("result-heading"),
  meals = document.getElementById("meals"),
  singleMeals = document.getElementById("single-meal");
const spinner = document.getElementById("spinner");

function fetchMeals(event) {
  event.preventDefault();

  singleMeals.innerHTML = "";
  if (searchvalue.value.trim() !== "") {
    let enteredValue = searchvalue.value;
    console.log(enteredValue);
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${enteredValue}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        result_heading.innerHTML = `<h3>search result for ${enteredValue}</h3>`;
        if (data.meals !== null) {
          //   console.log(data.meals);
          meals.innerHTML = data.meals
            .map((element) => {
              return `           
                  <div class='allMeals'>
                  <img src="${element.strMealThumb}" alt="${element.strMeal}">
                  <div class="meal-info" data-mealID="${element.idMeal}">
                    <h3>${element.strMeal}</h3>
                  </div>
                  </div>
                  `;
            })
            .join("");
        } else {
          alert("please try some other meals");
        }
      });
  } else {
    alert("please enter correctly");
  }
}

function getMealByID(mealID) {
  meals.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data.meals[0]);
      let singleMeal = data.meals[0];
      showMealToDom(singleMeal);
    })
    .catch((error) => console.log(error));
}

function showMealToDom(singleMeal) {
  console.log(singleMeal);
  const ingredients = [];
  //storing ingredients into array
  for (let i = 1; i < 20; i++) {
    if (singleMeal[`strIngredient${i}`]) {
      ingredients.push(
        `${singleMeal[`strIngredient${i}`]} - ${singleMeal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  console.log(ingredients);
  singleMeals.innerHTML = `
  <div class='single-meal'>
      <h2>${singleMeal.strMeal}</h2>
      <img src="${singleMeal.strMealThumb}" alt="${singleMeal.strMeal}">
      <div class='single-meal-info'>
          ${singleMeal.strCategory}
          ${singleMeal.strArea}
      </div>
      <div class="main">
          <p>${singleMeal.strInstructions}</p>
          <h2>Ingredients</h2>
          <ul>
             ${ingredients.map((ingredient) => `<li>${ingredient}</li>`)}   
          </ul>
        </div>
  </div>
  
  `;
}

function getRandomMeals() {
  result_heading.innerHTML = "";
  meals.innerHTML = "";
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((response) => response.json())
    .then((data) => {
      const singleMeal = data.meals[0];
      showMealToDom(singleMeal);
    });
}

formInput.addEventListener("submit", fetchMeals);

meals.addEventListener("click", (event) => {
  console.log(event.target);

  const mealInfo = event.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID");
    getMealByID(mealID);
  }
});

randombtn.addEventListener("click", getRandomMeals);
