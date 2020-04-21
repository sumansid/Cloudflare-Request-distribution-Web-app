/**
 * Suman Sigdel's Cloudflare internship Application (Full Stack)
 *
 * Description. (use period)
 *
 * @link   URL
 *
 * @author Suman Sigdel.
 * @Date  04/21/2020
 */
/** 

addEventListener('fetch', event => {	
  event.respondWith(handleRequest(event.request))
})

/*
 @param {Request} request
*/

const url = "https://cfw-takehome.developers.workers.dev/api/variants";

// Element handler class  -- Bonus Points
class ElementHandler {
	element(element) {
    // An incoming element, such as `div`
    
  }
  comments(comment) {
    // An incoming comment
  }

  text(text) {
    // An incoming piece of text
  }

}

//Generate random number
function getrand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Handle Request
async function handleRequest(request) {
	const v = await fetch(url)
	console.log(JSON.stringify(v))
	let variants = await fetch(url).then((resp)=>{return resp.json()});
	//let oursite = await fetch('http://localhost:8787/')
	let varArray = variants.variants
	console.log("reqeust headers", request.headers)
	let cIndex = getCookie("url", request)
	if(cIndex != null){
		console.log("loading from cookie index ", cIndex)
		var single_url = varArray[cIndex];
		let response = await fetch(single_url);
		return response;
	}else{
		let index = getrand(0, varArray.length-1)
		var single_url = varArray[index]
		console.log("loading out of cookie for index", index, "and url", single_url)
		let response = await fetch(single_url);
		response = setCookie("url", index, response)
		return response;
	}
}

// Set cookies function
function setCookie(key,value, resp) {
	const newRes = new Response(resp.body, resp)
	let expire = new Date() * 60 * 24 * 30 * 365 
	let cookie = `${key}=${value} ; Expire=${expire}; path='/'`
	newRes.headers.set("Set-Cookie", cookie)
	console.log("saving cookie", cookie)
	return newRes;
}

// Get cookie function
function getCookie(key, req) {
	let cookieData = req.headers.get("Cookie");
	if (cookieData != null) {
        let cList = cookieData.split(";");
        
        for (let cookie of cList) {

            let cookieIdx = cookie.split("=");
            if (cookieIdx[0] === key) {
                return cookieIdx[1];
            }
        }
    }
    return null;
}

// Main guideline


/*
1. Request the URLs from the API
Make a fetch request inside of your script's event handler to the URL 
https://cfw-takehome.developers.workers.dev/api/variants, 
and parse the response as JSON. 
The response will be an array of URLs, which should be saved to a variable.

2. Request a (random: see #3) variant
Make a fetch request to one of the two URLs, and return it as the response from the script.

3. Distribute requests between variants
The /api/variants API route will return an array of two URLs. 
Requests should be evenly distributed between the two urls, in A/B testing style. 
This means that when a client makes a request to the Workers script, 
the script should roughly return each variant around 50% of the time.

*/

// Bonus Points
/*
1. Changing copy/URLs
For each variant page, there are a number of items on the page that can be customized. Try changing the following values inside of the variant, adding your own text or URLs:

title: the title of the web page, displayed on the window or tab title in your browser.
h1#title: the main title of the page. By default, this displays "Variant 1" or "Variant 2"
p#description: the description paragraph on the page. By default, this displays the text "This is variant X of the take home project!".
a#url: a Call to Action link with strong emphasis on the page. Try changing this to a URL of your choice, such as your personal website, and make sure to update the text "Return to cloudflare.com" as well!
This can be done using the HTMLRewriter API built into the Workers runtime, or using simple text replacement.

2. Persisting variants
If a user visits the site and receives one of the two URLs, 
persist which URL is chosen in a cookie so 
that they always see the same variant when they return to the application. 
A cookie would be a great way to implement this!

3. Publish to a domain
If you have a registered domain/zone with Cloudflare, try deploying your project by customizing the zone_id and route in your wrangler.toml. 
Make sure to check out the Quick Start in the Workers docs for details on how to do this! 
Note: domains cost money, so if you don't have one, please don't feel obligated to buy one for this exercise. 
This is an extra credit task and you won't be penalized for skipping this one, we promise!


*/
