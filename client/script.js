import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat-container')

let loadInterval

function loader(element) {
  element.textContent = '';
  // Update the text content of the loading indicator
  loadInterval = setInterval(() => {
    element.textContent += '.';
    // If the loading indicator has reached three dots, reset it
    if (element.textContent === '...'){
      element.textContent = '';
    }
  }, 300)
}
// A function that's going to accept the element and text as parameters
function typeText(element, text){
  // at the start, we set index to zero 
  let index = 0;
  let interval = setInterval(() => {
    // if we're still typing, get the character under a specific index 
    // in the text the ai is going to return 
    if(index < text.length){
      element.innerHTML += text.chartAt(index)
      index++
    } else {
      clearInterval(interval)
    }
  }, 20)
}
// Generate a unique Id for every single message to be able to map over them
function generateUniqueId(){
  // in javascript, we generate unique ids by using the current time and date 
  const timestamp = Date.now();
  // to make it even more random, we can get a random number 
  const randomNumber = Math.random();
  // make it more random by creating a hexadecimal
  const hexadecimalString = randomNumber.toString(16);

  // return an id with a template string of timestamp and hexadecimal string 
  return `id-${timestamp}-${hexadecimalString}`;
}
function chatStripe(isAi, value, uniqueId){
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
        <img src=${isAi ? bot : user} alt="${isAi ? 'bot' : 'user'}" 
        />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `
  )
}
// create a handle submit to be the trigger to get the AI generated response 
const handleSubmit = async(event) => {
  event.preventDefault()
  // get the data that we type into the form 
  const data  = new FormData(form)
  // generate the users chat chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))
  // clear the textarea input 
  form.reset()

  // bot's chatStripe
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, data.get('prompt'))
  // as we continue typing we want to continue seeing the message 
  chatContainer.scrollTop = chatContainer.scrollHeight; // This is going to put the new message in view
  // fetch the newly created div 
  const messageDiv = document.getElementById(uniqueId)
  // turn on the loader 
  loader(messageDiv)


}
// To be able to see the changes we mae to our handleSubmit function, 
 // we have to call it 
form.addEventListener('submit', handleSubmit);
// Submit by pressing the Enter key 
form.addEventListener('keyup', (event) => {
  if(event.keyCode === 13){
    handleSubmit(event)
  }
})