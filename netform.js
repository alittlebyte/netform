//main
class Netform{
	constructor(model,view){
		this.model = model
		this.view = view		
	}
}

//model 
class NetformModel extends Netform{
	constructor(){
		super()
	}

	sendFormObject(formObj){
		fetch('https://jsonplaceholder.typicode.com/posts', {
			method:'POST',
			body: JSON.stringify(formObj),
			headers:{ 'Content-type': 'application/json; charset=UTF-8' }
		})
		.then(res => res.ok ? res.json() : Promise.reject(res))
		.then(data => console.log(data))
		.catch(err => console.log(err))
	}
}

//view
class NetformView extends Netform{
	constructor(){
		super()

		this.form = document.querySelector("#app")	
	}

	renderNetform(){
		let netformHolder = document.createElement("form"),
			netformName = document.createElement("input"), 
			netformNameErr = document.createElement("span"),
			netformEmail = document.createElement("input"), 
			netformEmailErr = document.createElement("span"),
			netformPhone = document.createElement("input"), 
			netformPhoneErr = document.createElement("span"),
			netformSubmit = document.createElement("input")

		netformHolder.setAttribute("id","netForm")
		netformName.setAttribute("id","netFormName")
		netformName.setAttribute("type","text")
		netformName.setAttribute("name","name")	
		netformName.setAttribute("placeholder","ФИО")
		netformNameErr.setAttribute("id","netFormNameError")
		netformNameErr.setAttribute("display","none")
		netformEmail.setAttribute("id","netFormEmail")
		netformEmail.setAttribute("type","text")
		netformEmail.setAttribute("name","email")
		netformEmail.setAttribute("placeholder","Эл. почта")
		netformEmailErr.setAttribute("id","netFormEmailError")
		netformEmailErr.setAttribute("display","none")
		netformPhone.setAttribute("id","netFormPhone")
		netformPhone.setAttribute("type","text")
		netformPhone.setAttribute("name","phone")
		netformPhone.setAttribute("placeholder","Телефон")
		netformPhoneErr.setAttribute("id","netFormPhoneError")
		netformPhoneErr.setAttribute("display","none")
		netformSubmit.setAttribute("id","netFormButton")
		netformSubmit.setAttribute("type","submit")

		netformHolder.appendChild(netformName)
		netformHolder.appendChild(netformNameErr)
		netformHolder.appendChild(netformEmail)
		netformHolder.appendChild(netformEmailErr)
		netformHolder.appendChild(netformPhone)
		netformHolder.appendChild(netformPhoneErr)
		netformHolder.appendChild(netformSubmit)
		this.form.appendChild(netformHolder)
	}
}

//controller
class NetformController extends Netform{
	constructor(model,view){
		super(model,view)
	
		this.addListenersAndValidate()
	}

	validateName(str){
		if(!str){
			document.querySelector("#netFormNameError").style.display = "inline"
			document.querySelector("#netFormNameError").style.color = "#B80000"
			document.querySelector("#netFormNameError").textContent = "Строка не может быть пустой"
		} else if(!/^([А-Я]{1}[а-я]+) ([А-Я]{1}[а-я]+) ([А-Я]{1}[а-я]+)$/.test(str)){
			document.querySelector("#netFormNameError").style.display = "inline"
			document.querySelector("#netFormNameError").style.color = "#B80000"
			document.querySelector("#netFormNameError").textContent = "Строка должна содержать только слова с заглавной буквы"
		} else {
			document.querySelector("#netFormNameError").style.display = "inline"
			document.querySelector("#netFormNameError").style.color = "#C9CC00"
			document.querySelector("#netFormNameError").textContent = "Всё ОК"
		}
	}	

	validateEmail(str){
		if(!str){
			document.querySelector("#netFormEmailError").style.display = "inline"
			document.querySelector("#netFormEmailError").style.color = "#B80000"
			document.querySelector("#netFormEmailError").textContent = "Строка не может быть пустой"
		} else if(!/[A-Za-z0-9._]{3,}@gmail\.com/.test(str)){
			document.querySelector("#netFormEmailError").style.display = "inline"
			document.querySelector("#netFormEmailError").style.color = "#B80000"
			document.querySelector("#netFormEmailError").textContent = "Почта должна состоять из английских букв, цифр, . и _ И принадлежать gmail.com"			
		} else {
			document.querySelector("#netFormEmailError").style.display = "inline"
			document.querySelector("#netFormEmailError").style.color = "#C9CC00"
			document.querySelector("#netFormEmailError").textContent = "Всё ОК"
		}
	}

	validatePhone(str){
		if(!str){
			document.querySelector("#netFormPhoneError").style.display = "inline"
			document.querySelector("#netFormPhoneError").style.color = "#B80000"
			document.querySelector("#netFormPhoneError").textContent = "Строка не может быть пустой"
		} else if((!str.startsWith('+7') || str.length!==12) && (!str.startsWith('8') || str.length!==11) && (!str.startsWith('07') || str.length!==12)){
			document.querySelector("#netFormPhoneError").style.display = "inline"
			document.querySelector("#netFormPhoneError").style.color = "#B80000"
			document.querySelector("#netFormPhoneError").textContent = "Телефон должен начинаться на +7,8 или 07 и содержать 12, 11 и 12 цифр соответственно"			
		} else {
			document.querySelector("#netFormPhoneError").style.display = "inline"
			document.querySelector("#netFormPhoneError").style.color = "#C9CC00"
			document.querySelector("#netFormPhoneError").textContent = "Всё ОК"
		}		
	}

	async addListenersAndValidate(){
		await this.view.renderNetform()
		document.querySelector("#netFormName").addEventListener("blur", e =>{
			let strOnlyCyrillic = e.target.value.trim().replace(/[^А-Яа-я ]/g,'').replace(/\s\s*/g,' ')
			e.target.value = strOnlyCyrillic
			this.validateName(strOnlyCyrillic)
		})
		document.querySelector("#netFormEmail").addEventListener("blur", e =>{
			let semiValidEmail = e.target.value.trim().replace(/[^A-Za-z0-9._@]/g,'')
			e.target.value = semiValidEmail
			this.validateEmail(semiValidEmail)
		})
		document.querySelector("#netFormPhone").addEventListener("blur", e =>{
			let phoneDigits = e.target.value.trim().replace(/[^\d+]*/g, '')
			e.target.value = phoneDigits
			this.validatePhone(phoneDigits)
		})
		document.querySelector("#netForm").addEventListener("submit", e =>{
			e.preventDefault()
			if(!(document.querySelector("#netFormNameError").style.color === 'rgb(201, 204, 0)') || !(document.querySelector("#netFormEmailError").style.color === 'rgb(201, 204, 0)') || !(document.querySelector("#netFormPhoneError").style.color === 'rgb(201, 204, 0)')){
				return false;
			}
			let formObject = Object.fromEntries(new FormData(e.target))
			this.model.sendFormObject(formObject)
		})
	}
}

//app
new NetformController(new NetformModel(),new NetformView())