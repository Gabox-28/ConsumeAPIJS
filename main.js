const API = 'https://api.thedogapi.com/v1/images/search?limit=8&api_key=live_hD15gckCntk0uYtmvE3LdLsDiLeePdBvTCfYYxFYRLxeg9NWGUbRbvwCtjPRw90l'
const APIFavorites = 'https://api.thedogapi.com/v1/favourites?limit=20'
const APIDeleteFavorites = 'https://api.thedogapi.com/v1/favourites/'
const APIUpload = 'https://api.thedogapi.com/v1/images/upload'
const catsContainer = document.querySelector('.cards-container')
const favoriteCatsContainer = document.querySelector('.favorites-cards-container')

async function GetDogs(APIUrl){
    const response = await fetch(APIUrl, {
        headers: {
            'X-API-KEY': 'live_hD15gckCntk0uYtmvE3LdLsDiLeePdBvTCfYYxFYRLxeg9NWGUbRbvwCtjPRw90l'
        }
    })
    return await response.json()
}

async function RenderDogs(){
    try {
        const cats = await GetDogs(API)
        cats.forEach(item => {
            let newCard = document.createElement('div')
            newCard.classList.add('card')

            let newButton = document.createElement('button')
            newButton.classList.add('favorite-button')
            newButton.onclick = () => SaveFavoriteDog(item.id)

            let newFavoriteIcon = document.createElement('img')
            newFavoriteIcon.src = './heart.png'

            let newImage = document.createElement('img')
            newImage.src = item.url

            newButton.appendChild(newFavoriteIcon)
            newCard.appendChild(newButton)
            newCard.appendChild(newImage)
            catsContainer.appendChild(newCard)

        })
    }catch (error){
        console.log(error)
    }
}

async function RenderFavoriteDogs(){
    try {
        const cats = await GetDogs(APIFavorites)
        favoriteCatsContainer.innerHTML = ''
        cats.forEach(item => {
            let newCard = document.createElement('div')
            newCard.classList.add('card')

            let newButton = document.createElement('button')
            newButton.classList.add('favorite-button')
            newButton.onclick = () => DeleteFavoriteDog(item.id)

            let newFavoriteIcon = document.createElement('img')
            newFavoriteIcon.src = './broken-heart.png'

            let newImage = document.createElement('img')
            newImage.src = item.image.url

            newButton.appendChild(newFavoriteIcon)
            newCard.appendChild(newButton)
            newCard.appendChild(newImage)
            favoriteCatsContainer.appendChild(newCard)
        })
    }catch (error){
        console.log(error)
    }
}

async function SaveFavoriteDog(id){
    const rest = await fetch(APIFavorites, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'live_hD15gckCntk0uYtmvE3LdLsDiLeePdBvTCfYYxFYRLxeg9NWGUbRbvwCtjPRw90l'
        },
        body: JSON.stringify({
            image_id: id
        })
    })

    RenderFavoriteDogs()
}

async function DeleteFavoriteDog(id){
    const rest = await fetch(APIDeleteFavorites + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'live_hD15gckCntk0uYtmvE3LdLsDiLeePdBvTCfYYxFYRLxeg9NWGUbRbvwCtjPRw90l'
        },
    })

    RenderFavoriteDogs()
}

function RenderPreviewImage(){
    const files = document.querySelector('#file').files
    const imagePreview = document.querySelector('.input-preview')
    const submitButton = document.querySelector('.submit-button')

    if (files.length > 0){
        const fileReader = new FileReader()

        fileReader.onload = function (e){
            imagePreview.classList.remove('hidden')
            submitButton.classList.remove('hidden')
            imagePreview.src = e.target.result
        }

        fileReader.readAsDataURL(files[0])
    }
}

async function UploadDogPhoto(){
    const form = document.getElementById('uploading-form')
    const formData = new FormData(form)

    console.log(form)
    console.log(formData)

    const res = await fetch(APIUpload, {
        method: 'POST',
        headers: {
            'X-API-KEY': 'live_hD15gckCntk0uYtmvE3LdLsDiLeePdBvTCfYYxFYRLxeg9NWGUbRbvwCtjPRw90l'
        },
        body: formData
    })

    const data = await res.json()

    if (res.status !== 201){
        console.log(`Hubo un error ${res.status} ${res.message}`)
    }else{
        console.log(data)
        SaveFavoriteDog(data.id)
    }

}

RenderDogs()
RenderFavoriteDogs()
