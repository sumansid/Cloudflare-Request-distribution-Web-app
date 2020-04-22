addEventListener('fetch', event => {	
  event.respondWith(handleRequest(event.request))
})

/*
 @param {Request} request
*/

const url = "https://cfw-takehome.developers.workers.dev/api/variants";
const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/pikachu"
const pokemonUrl2 = "https://pokeapi.co/api/v2/pokemon/ditto"
const githubURL = "https://wwww.github.com/users/sumansid";


//Generate random number
function getrand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function handleRequest(request) {
	
	let variants = await fetch(url).then((resp)=>{return resp.json()});
	let pikachuinfo = await fetch(pokemonUrl).then((resp)=>{return resp.json()});
	let dittoinfo = await fetch(pokemonUrl2).then((resp)=>{return resp.json()});
	
	let varArray = variants.variants
	
	console.log("reqeust headers", request.headers.get("Cookie"))
	//let cookies = request.headers.get("Cookie")
	let cIndex = getCookie(request, "url")
	if(cIndex != null){
		console.log("loading from cookie index ", cIndex)
		var single_url = varArray[cIndex];
		let response = await fetch(single_url);
		const elementHandler = new ElementHandler(dittoinfo.name)
		const elementDescription = new ElementHandler(dittoinfo.order)
		response = new HTMLRewriter()
		.on("h1#title", elementHandler)//we wants to change the element with ID title
		.on("p#description", elementDescription)
		.transform(response)

		return response;
	}else{
		let index = getrand(0, varArray.length-1)
		var single_url = varArray[index]
		let response = await fetch(single_url);
		response = setCookie("url", index, response)
		const elementHandler = new ElementHandler(pikachuinfo.name)
		const elementDescription = new ElementHandler(pikachuinfo.order)
		const elementURL = new ElementHandler(githubURL)
		response = new HTMLRewriter()
		.on("h1#title", elementHandler)
		.on("p#description", elementDescription)
		.on("a#url", elementURL)
		.on("href", elementURL)
		.transform(response)
		return response;
	}

}

class ElementHandler {
	//here in the constructor, we can receive some information from request
	constructor(value){
		this.value = value
	}
	element(element) {
		
		element.setInnerContent(this.value)
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
