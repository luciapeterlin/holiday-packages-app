// Selectores

const bot = document.getElementById("bot");
const buttonCustomerService = document.querySelectorAll(".buttonCustomerService");
const customerServiceBtn = document.getElementById("customerServiceBtn");
const response = document.getElementById("botResponse");
const cartCounter = document.getElementById("cartCounter");
const tooltipContainer = document.getElementById("tooltipContainer");
const totalResults = document.getElementById("totalResult");
const cardsContainer = document.getElementById("cardsContainer");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const renderCart = document.getElementById("renderCart");
const creditCardHelp = document.getElementById("creditCardHelp");
const bankSelection = document.getElementById("selectBank")
const userName = document.getElementById("inputName");
const userEmail = document.getElementById("inputEmail");
const form = document.getElementById("formValidation");
const searchInput = document.getElementById("searchInput");
const submitForm = document.getElementById("submitForm");

// Funciones que se inician cuando se carga el documento

window.addEventListener('DOMContentLoaded', (event) => {
  customerService();
  renderSubtotal();
  renderCartItems();
  requestData();
});

// Asistente virtual

const date = new Date();
const hour = date.getHours(); 

customerServiceBtn.addEventListener("click", customerService);

function customerService(){
  if (hour >= 9 && hour <= 18){    
    bot.style.display === "none"? bot.style.display = "block" : bot.style.display = "none"
  } else {
    customerServiceBtn.classList.add("disabled");
    let tooltip = document.createElement("div");
    tooltip.innerHTML = `<div class="alert alert-danger" role="alert">❗ En este momento no estamos disponible. Nuestro horario de atención es de 9 a 18 hs.</div>`;
    tooltipContainer.appendChild(tooltip);
  }
}

for (let i = 0; i < buttonCustomerService.length; i++) {
  buttonCustomerService[i].addEventListener("click", function() {
    let user_question = event.target.id;
    switch (user_question) {
    case "1":
      response.innerHTML = `<div>Nuestros métodos de pago son: tarjeta de crédito, tarjeta de débito o con saldo pre-cargado en tu cuenta de MercadoPago.</div>`;
      break;
    case "2":
      response.innerHTML = `<div>Nuestro horario de atención es de 9 a 18 hs.</div>`;
      break;
    case "3":
      response.innerHTML = `<div>Para utilizarla en nuestra web, al momento de finalizar tu compra y elegir el medio de pago, en el recuadro donde dice UTILIZAR GIFT CARD colocá los 16 dígitos y en el siguiente recuadro, los 3 del código de seguridad. Un dato interesante, si estás comprando desde el celular, utilizalo de manera horizontal así se ven los dos recuadros, sino no se visualizan!</div>`;
      break;
    default:
      console.log("Ocurrió un error");
    }
  });
}

// Paquetes turísticos

function Packages(name, price, days, availability, image, id){
  this.name = name;
  this.price = price;
  this.days = days;
  this.availability = availability;
  this.image = image;
  this.id = id;
  this.available = function() {
    return "El paquete " + this.name + " no se encuentra disponible.";
  };
}

const miami = new Packages("Miami", 1200, 7, true, "miami.jpg", 1);
const mexico = new Packages("Cancún y Playa del Cármen", 2500, 10, true, "mexico.jpg", 2);
const tailandia = new Packages("Tailandia", 2000, 7, false, "tailandia.jpg", 3);
const egipto = new Packages("Egipto y Turquía", 3000, 15, false, "egipto.jpg", 4);
const disney = new Packages("Disney", 1800, 10, true, "disney.jpg", 5);
const brasil = new Packages("Buzios y Río de Janeiro", 1000, 7, true, "brasil.jpg", 6);
const grecia = new Packages("Islas Griegas", 2500, 10, false, "grecia.jpg", 7);
const ushuaia = new Packages("Ushuaia", 1000, 5, true, "ushuaia.jpg", 8);
const espana = new Packages("España y Marruecos", 2800, 10, true, "marruecos.jpg", 9);
const iguazu = new Packages("Cataratas de Iguazú", 800, 4, false, "iguazu.jpg", 10);

console.log(mexico.available());
console.log(disney.available());

const arrInternational = new Array(miami, mexico, tailandia, egipto, disney, espana, brasil, grecia);
const arrNational = new Array(ushuaia, iguazu);
const updatedArr = [...arrInternational, ...arrNational]

// Creación de cards 

for (array of updatedArr){

  if (array.availability == true){
    isAvailable = "Cupos disponibles";
    badgeType = "bg-warning text-dark";
    opacityImg = " ";
    disableButton = " ";
  } else {
    isAvailable = "Agotado";
    badgeType = "bg-danger";
    opacityImg = "opacity";
    disableButton = "disabled";
  }

  let container = document.createElement("div");
  container.innerHTML =

  `<div class="card">
  <img src="img/${array.image}" class="card-img-top ${opacityImg}" id="card-img" alt="Paquete turístico a ${array.name}">
  <div class="card-body">
    <h5 class="card-title">${array.name}</h5>
    <h3>$${array.price}</h3>
    <p class="card-text">${array.days} noches</p>
    <span class="badge ${badgeType}" id="badge">${isAvailable}</span>
    <a href="#" class="btn btn-primary ${disableButton}" onclick="initiatePurchase(${array.id})">Agregar al carrito</a>
  </div>
</div>`
  
  cardsContainer.appendChild(container);
}

// Iniciar compra

let cartItems = JSON.parse(localStorage.getItem("paquete")) || [];

function initiatePurchase(id){

  Toastify({
    text: "Producto agregado al carrito",
    className: "info",
    close: true,
    gravity: "bottom",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)", right: "30px", marginBottom:"100px"
    }
  }).showToast();

  if(cartItems.some((selectedItem) => selectedItem.id === id)){
    changeNumberPlus(id);
  } else{
    const selectedItem = updatedArr.find((item) => item.id === id);
    cartItems.push({
      ...selectedItem,
      numberOfUnits: 1,
    });
    localStorage.setItem("paquete", JSON.stringify(cartItems)); 
    renderCartItems();
    renderSubtotal();
  }
}

// Mostrar card de paquetes en el carrito

function renderCartItems(){
  renderCart.innerHTML = "";
  if (cartItems.length < 1){
    let containerRenderCart = document.createElement("div");
    containerRenderCart.innerHTML = `<h3>Carrito vacio</h3>`
    renderCart.appendChild(containerRenderCart);
    form.style.display = "none";
  } else{
      form.style.display = "block"
      cartItems.forEach((item) => {
      let containerRenderCart = document.createElement("div");
      containerRenderCart.innerHTML = 
      `
      <div class="card-cart mb-3">
        <div class="row">
          <div class="col-md-4 mr20">
            <img src="img/${item.image}" class="img-fluid rounded-start" alt="${item.name}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">Subtotal: $${item.price * item.numberOfUnits}</p>
              <div class="d-flex align-items-center">
                <span class="pasajeros">Pasajeros:</span>
                <button class="btn btn-primary" id="minus" onclick="changeNumberMinus(${item.id})">-</button>
                <div class="number" id="quantity">${item.numberOfUnits}</div>
                <button class="btn btn-primary" id="plus" onclick="changeNumberPlus(${item.id})">+</button>
                <button class="btn btn-ligh" onclick="eliminateItem(${item.id})"><i class="fas fa-trash-alt"></i></button>
            </div>
            </div>
          </div>
        </div>
      </div>`
      renderCart.appendChild(containerRenderCart);
    })
  }
  renderSubtotal();
  localStorage.setItem("paquete", JSON.stringify(cartItems)); 
}

// Eliminar items del carrito

function eliminateItem(id){
  cartItems = cartItems.filter((item) => item.id !== id);
  localStorage.setItem("paquetes", JSON.stringify(cartItems));
  renderCartItems();
}

// Sumar items del carrito

function changeNumberPlus(id){
  cartItems = cartItems.map((item) => {
    let numberOfUnits = item.numberOfUnits;
    if(item.id === id){
        numberOfUnits++;
    } else{
      console.log("error");
    }
    return {
      ...item,
      numberOfUnits,
    };
  })
  renderCartItems();
}

// Quitar items del carrito

function changeNumberMinus(id){
  cartItems = cartItems.map((item) => {
    let numberOfUnits = item.numberOfUnits;
    if(item.id === id && numberOfUnits > 1){
        numberOfUnits--;
    } else{
      console.log("error");
    }
    return {
      ...item,
      numberOfUnits,
    };
  })
  renderCartItems();
}

// Precio total

function renderSubtotal(){
  totalPrice = 0;
  totalItemsPrueba = 0;
  cartItems.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
    totalItemsPrueba += item.numberOfUnits;
  })
  cartCounter.innerHTML = totalItemsPrueba;
  priceCalculator();
}

// Elección de tarjetas y descuentos

bankSelection.addEventListener("change", priceCalculator);

function priceCalculator(){
  let bank = document.getElementById("selectBank").value;
  cartTotalPrice.innerText = "Total: $" + totalPrice;

  switch (bank) {
    case "ICBC":
      var user_bank = `${bank}`;
      break;
    case "HSBC":
      var user_bank = `${bank}`;
      break;
    case "Santander":
      var user_bank = `${bank}`;
      break;
    case "BBVA":
      var user_bank = `${bank}`;
      break;
    case "Macro":
      var user_bank = `${bank}`;
      break;
    default:
      console.log("La tarjeta de crédito del usuario no cuenta con beneficios en el sitio");
  }

  if (user_bank === "ICBC" || user_bank === "Santander"){
    const total_price = (totalPrice* 0.8).toFixed(2);
    creditCardHelp.innerText = `💳 Con tu tarjeta ${user_bank}, obtené todos los días 20% de descuento. El precio total es $${total_price}`;
    cartTotalPrice.innerHTML = "Total: $" + total_price;
  } else if (user_bank === "Macro"){
    const total_price = (totalPrice* 0.85).toFixed(2);
    creditCardHelp.innerText = (`💳 Disfrutá de 15% de descuento con tu tarjeta ${user_bank}. El precio total es $${total_price}`);
    cartTotalPrice.innerHTML = "Total: $" + total_price;
  } else if (user_bank === "HSBC" || user_bank === "BBVA"){
    const total_price = (totalPrice* 0.90).toFixed(2);
    creditCardHelp.innerText = (`💳 Obtené todos los días 10% de descuento con tu tarjeta ${user_bank}. El precio total es $${total_price}`);  
    cartTotalPrice.innerHTML = "Total: $" + total_price;
  } else {
    creditCardHelp.innerText = (`💳 Actualmente tu tarjeta no cuenta con beneficios en nuestro sitio. El precio total es $${totalPrice}`);
    cartTotalPrice.innerHTML = "Total: $" + (totalPrice.toFixed(2));
  }
}

// Validación formulario

submitForm.addEventListener("click", function () {
  if(userName.value == "" || userEmail.value == ""){
    form.classList.add('was-validated');
  } else{
    let finishedPurchase = document.createElement("div");
    finishedPurchase.innerHTML = `<div class="alert alert-success" role="alert">¡Muchas gracias por tu compra!</div>`
    document.getElementById("purchaseMessage").appendChild(finishedPurchase);
    setTimeout(function(){
      location.reload();
      localStorage.clear();
    }, 2000);
  }
})

// Search de paquetes

searchInput.addEventListener("keyup", function(){
  let searchInput = document.getElementById("searchInput").value.toUpperCase();
  let cardsContainer = document.getElementById("cardsContainer");
  let card = cardsContainer.getElementsByClassName("card");
  let resultsPackages = []
  for (i = 0; i < card.length; i++) {
    title = card[i].getElementsByTagName("h5")[0];
    input = title.innerText;
    if (input.toUpperCase().indexOf(searchInput) > -1) {
      card[i].style.display = "block";
      resultsPackages.push(card[i])
      totalResults.innerText = "Contamos con " + resultsPackages.length + " paquetes turísticos.";
    } else {
      card[i].style.display = "none";  
    }
  }
});

// Fetch API feriados nacionales

const requestData = async () =>{
  let month = ("0" +(date.getMonth() + 1)).slice(-2)
  let day = ("0" + date.getDate()).slice(-2)
  let year = date.getUTCFullYear();
  let newdate = year + "-" + month + "-" + day;

  let res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/AR`);
  let data = await res.json();

  data.forEach((data) => {
    let fechaApi = data.date;
    if (newdate < fechaApi){
      let alertFeriado = document.createElement("div");
      alertFeriado.innerHTML = `<p>¡Prepará tus vacaciones! El próximo feriado es <strong>${data.localName}</strong> (${data.date})</p>`
      document.getElementById("alertFeriadoContainer").append(alertFeriado).firstChild;
    } else{
      console.log("Otros feriados");
    }
  })
}
