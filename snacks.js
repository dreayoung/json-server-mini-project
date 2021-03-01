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
    let inputFlavor = e.target[1].value
    let inputCalories = e.target[2].value
  
    // let inputImg = e.target[3].value
    imags(inputName)
    .then(res => {
        if(res.products.length === 0) {
            alert('Snack Not Available')
        }else {
        let img = res.products[0].images[0].base_url+res.products[0].images[0].primary
        addSnackAPI(inputName, inputFlavor, inputCalories,img)
        .then(val => snackDisplay(val))
         }
    })
    
}

async function addSnackAPI(name, flavor, calories, img){
    let snacks = {
        brand_name : name,
        calories : calories,
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


async function imags(input) {
 let res = await fetch(`https://target-com-store-product-reviews-locations-data.p.rapidapi.com/product/search?store_id=3991&keyword=${input}&sponsored=1&limit=1&offset=0`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "3e0fa96457mshe4216ced8e5b3ccp1aba84jsne35b12b8a58a",
		"x-rapidapi-host": "target-com-store-product-reviews-locations-data.p.rapidapi.com"
	}
})
let val = await res.json()
return val
}

async function load(){
    let response = await fetch('http://localhost:3000/snacks')
    let data = await response.json()
    return data
}
