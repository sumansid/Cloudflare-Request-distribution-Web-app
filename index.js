addEventListener('fetch', event => {	
  event.respondWith(handleRequest(event.request))
})

/*
 @param {Request} request
*/

const url = "https://cfw-takehome.developers.workers.dev/api/variants";
const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/"
const githubURL = "https://www.github.com/sumansid";
const madeBy = "Made by Suman Sigdel"


//Generate random number
function getrand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function handleRequest(request) {
	let variants = await fetch(url).then((resp)=>{return resp.json()});
	let varArray = variants.variants
	let cIndex = getCookie(request, "url")
    if(cIndex != null){
		let url = varArray[cIndex]
		let response = await fetch(url);
        return buildResponse(response, cIndex);
	}else{
		let index = getrand(0, varArray.length-1)
        let url = varArray[index];
		let response = await fetch(url);
		response = setCookie("url", index, response)
		return buildResponse(response, index);
	}
}

async function buildResponse(response, index){
    let pokemonIndex = parseInt(index)+1;
    let pokemonIndexUrl = pokemonUrl + "/" + pokemonIndex;
    let pokemon = await fetch(pokemonIndexUrl).then((resp)=>{return resp.json()});
    const elementTitle = new ElementHandler("Variant " + pokemonIndex + " - " + madeBy)
    const elementName = new ElementHandler(pokemon.name)
	const elementDescription = new ElementHandler(madeBy)
	const elementURL = new LinkHandler("My github", githubURL)
    const elementSprite = new ImageHandler("Pokemon", pokemon.sprites.front_shiny)
	response = new HTMLRewriter()
    .on("title", elementTitle)
	.on("h1#title", elementName)
	.on("p#description", elementDescription)
	.on("a#url", elementURL)
    .on("svg", elementSprite)
	.transform(response)
    return response;
}


class ElementHandler {
	//here in the constructor, we can receive some information from request
	constructor(value){
		this.value = value
	}
	//and here wwe will replace some attribute from DOM element
	element(element) {
		//we can use any DOM selector
		//the innerHTML change the content of element
		element.setInnerContent(this.value)
	}
}

class LinkHandler {
	//here in the constructor, we can receive some information from request
	constructor(value, link){
		this.value = value
        this.link = link;
	}
	//and here wwe will replace some attribute from DOM element
	element(element) {
		//we can use any DOM selector
		//the innerHTML change the content of element
		element.setInnerContent(this.value)
        element.setAttribute("href", this.link)
        element.setAttribute("target", "_blank")
	}
}

class ImageHandler {
	//here in the constructor, we can receive some information from request
	constructor(alt, url){
		this.alt = alt
        this.url = url;
	}
	//and here wwe will replace some attribute from DOM element
	element(element) {
		//we can use any DOM selector
		//the innerHTML change the content of element
		element.tagName = "img"
        element.setAttribute("src", this.url)
        element.setAttribute("alt", this.alt)
        element.setAttribute("class", "")
	}
}

function setCookie(key,value, resp) {
	const newRes = new Response(resp.body, resp)
	let expire = new Date() * 60 * 24 * 30 * 365 
	let cookie = `${key}=${value} ; Expire=${expire}; path='/'`
	newRes.headers.set("Set-Cookie", cookie)
	console.log("saving cookie", cookie)
	return newRes;
}

function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get("Cookie")
  if (cookieString) {
    let cookies = cookieString.split(";")
    cookies.forEach((cookie) => {
      let cookieName = cookie.split("=")[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split("=")[1]
        result = cookieVal
      }
    })
  }
  return result
}
