document.addEventListener("DOMContentLoaded", () => {
    load().then(data => snackDisplay(data))

    let form = document.querySelector(".add-form")
    form.addEventListener("submit", addSnack)
    
})

function snackDisplay(snack){
    // console.log(snack)
    let coll = document.querySelector("#collection")

    if (!Array.isArray(snack)){

        let card = document.createElement("div")
        card.classList.add("card")

        card.innerHTML = `<h2 id="snack-name">${snack.brand_name}</h2>
        <div>${snack.flavor}</div>
        <img id="snack-img" alt="Rex" src="${snack.image}" class="avatar" />
        <h4>${snack.calories} calories per serving</h4>
    
        <button class="btn" id="${snack.id}">Remove</button>`
    
        coll.append(card)

    }
    else {
        snack.forEach(type => {
            let card = document.createElement("div")
            card.classList.add("card")

            card.innerHTML = `<h2 id="snack-name">${type.brand_name}</h2>
            <div>${type.flavor}</div>
            <img id="snack-img" alt="Rex" src="${type.image}" class="avatar" />
            <h4>${type.calories} calories per serving</h4>
        
            <button class="btn" id="${type.id}">Remove</button>`

            coll.append(card)
        });
    }
    document.querySelector(".add-form").reset()
    removeSnack()
}

function addSnack(e){
    e.preventDefault()
    
    let inputName = e.target[0].value
    let inputFlavor = e.target[2].value
    let inputCalories = e.target[3].value
    let inputImg = e.target[4].value

    addSnackAPI(inputName, inputProductType, inputFlavor, inputCalories, inputImg)
    .then(val => snackDisplay(val))
}

async function addSnackAPI(name, type, flavor, calories, img){
    let snacks = {
        brand_name : name,
        calories : calories,
        product_type : type,
        flavor : flavor,
        image : img
    }

    let options = {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(snacks)
    }

    let response = await fetch('http://localhost:3000/snacks', options)
    let data = await response.json()
    return data
}

function removeSnack(){
    let button = document.querySelectorAll(".btn")

    button.forEach(snack => {
        snack.addEventListener("click", (e) => {
            removeSnackAPI(e.target.parentNode, e.target.id)
        })
    })
}

async function removeSnackAPI(snackCard, snackId){
    let options = {
        method : "DELETE",
        headers : {"Content-Type" : "application/json"}
    }

    await fetch(`http://localhost:3000/snacks/${snackId}`, options)

    document.getElementById("collection").removeChild(snackCard)
}

async function load(){
    let response = await fetch('http://localhost:3000/snacks')
    let data = await response.json()
    return data
}
