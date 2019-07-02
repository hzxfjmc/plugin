console.log(`立即执行了这个js文件`);
/**
 * 根据一屏一屏的页面来进行业务数据的模拟。
 * case @number 第几屏
 *  网址
 */
//case 1 login

function case1() {
	let url_ = window.location.href;
    let userName = document.getElementById("sleUserName");
    let password = document.getElementById("slePassword");
	let submit = document.getElementsByClassName("clsButton");
	let caseId = url_.split("caseId=")[1].split('&userInfo=')[0]
	localStorage.setItem('caseId',caseId);
	localStorage.setItem('userInfo',decodeURIComponent(url_).split("userInfo=")[1]);
    userName['value'] = JSON.parse(localStorage.userInfo).userId;
	password['value'] = JSON.parse(localStorage.userInfo).password;
    submit['Login'].click();
}

//case2 serch
function case2() {
    let policyNumber = document.getElementById("nricval");
    let serch_ = document.getElementsByClassName('clsButton')[1];
    policyNumber['value'] = JSON.parse(localStorage.userInfo).nric;
    serch_.click();
    localStorage.setItem("state","3");
}

// case 3
function case3(){
    let startOrder_ = document.getElementById("Menu$1");
    localStorage.setItem("state","4");
    startOrder_.click();
}

//case3 submit
//替换dom来提交表单
function replaceDom_() {
    let LoginMain_ = document.querySelector("#LoginMain");
    LoginMain_.removeChild(LoginMain_.querySelector('table'));
    let data = `<table align="center" border="0" cellpadding="1" 
    cellspacing="1" width="100%" style="color:white;border:1px" solid="" white;="">
    <colgroup><col align="center" width="40%"><col align="center"><col align="center"></colgroup>
    <tbody><tr><td colspan="3" align="center" class="clsLoginTerms">
    <b>请输入你的账号密码</b></td></tr><tr><td>&nbsp;</td>
    </tr><tr><td align="right" class="clsLoginTerms">姓名</td><td align="left">
    <input maxlength="31" type="text" id="sleUserName" name="sleUserName" autocomplete="off" value="" style="width:25ex"></td></tr><tr><td align="right" class="clsLoginTerms">Password&nbsp;&nbsp;</td>
    <td align="left"
    ><input maxlength="15" type="password" id="slePassword" name="slePassword" autocomplete="off" style="width:25ex"></td></tr><tr><td></td><td align="left">
    <input type="hidden" id="Nonce" name="Nonce"><input type="hidden" id="hpwd" name="hpwd"><input class="clsButton" style="width:25ex" name="Login" type="submit" value="Login">
    </td></tr></tbody></table>`
    LoginMain_.innerHTML = data;
}

// case 4
function case4(){
	let clsDocBody = document.querySelectorAll(".clsDocBody")[1];
	// clsDocBody.innerHTML = `<button type="button" onclick="sayHi()">Click Me!</button>`
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.language = "Javascript";
	script.text = `var isChoice = 0;
	function callAlert(pMsg,pTitle)
	{
		localStorage.setItem("state","5");
		var answer = true;  
		if (answer == true)
   			isChoice = 6;
		else
			isChoice = 0;
		return isChoice;
	}`;
	clsDocBody.appendChild(script);
    // let data_ = document.querySelector("#GUIDate_OfAccident");
    // data_.value = "04/04/2019";
    // let month_ = document.querySelector("#slcTimeOfAcc_hh");
    // month_.value = "04";
    // let day_ = document.querySelector("#slcTimeOfAcc_mm");
    // day_.value="45";  
    // let txtAcc_ = document.querySelector("#txtLocOfAcc");
    // txtAcc_.value="43fsdfdsf243545424";
    // let next_ = document.getElementById("Menu$2");
	// next_.click();
	// localStorage.setItem("state","5");
}

function case5(){
	let input_ = document.getElementsByTagName("input");
	let select_ = document.getElementsByTagName("select");
	let xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL(`https://sg-service-tools.yhulian.cn/api/v1/ocr_result/${localStorage.caseId}`), true);
	xhr.setRequestHeader('Content-Type','text/plain;charset=UTF-8');	
	xhr.send();
	xhr.onreadystatechange = function (){		let data = JSON.parse(xhr.responseText).data;
		let otherInfo = JSON.parse(data.otherInfo);
		let driverLicenseFront = JSON.parse(data.driverLicenseFront);
		let driverLicenseBack = JSON.parse(data.driverLicenseBack);
		let idCardFront = JSON.parse(data.idCardFront);
		let idCardBack = JSON.parse(data.idCardBack);
		let policyPartOne = JSON.parse(data.policyPartOne);
		// let policyPartTwo = JSON.parse(data.policyPartTwo);
		select_['ddlbLossCtryState'].value = "Singapore";
		//Date Of Birth
		if(idCardFront.dateOfBirth) input_['GUIDate_DOB'].value = idCardFront.dateOfBirth;
		//Driving Pass Date
		if(idCardBack.dateOfIssue) input_['GUIDate_DrivingPass'].value = idCardBack.dateOfIssue;
		//身份证
		if(idCardFront.cardNo){
			input_['SLEIDOWNERID1'].value = idCardFront.cardNo;
			input_['SLEIDDRIVERID1'].value = idCardFront.cardNo;
		}
		if(driverLicenseFront.name){
			input_['SLEIDDRIVERnm'].value = driverLicenseFront.name;
			input_['SLEIDOWNERnm'].value = driverLicenseFront.name;
		}
		//车辆注册
		// console.log(policyPartTwo)
		if(policyPartOne.registration) input_['sleVehicleRegNo'].value = policyPartOne.registration;
		//email
		if(otherInfo['txtInsEMail']){
			input_['txtInsEMail'].value = otherInfo['txtInsEMail'];
			input_['txtEMail'].value = otherInfo['txtInsEMail'];
		} 
		//室内室外
		if(otherInfo['selOccupation']) select_['selOccupation'].value = otherInfo['selOccupation'];
		//替换号码
		if(otherInfo['Alternative Phone No option']) select_['InsuredPhonetype'].value = otherInfo['Alternative Phone No option'];
		if(otherInfo['InsuredPhoneNo']) input_['InsuredPhoneNo'].value = otherInfo['InsuredPhoneNo'];
		//手机号码
		if(otherInfo['local'] == "local"){
			if(otherInfo['DRIVERMOBILENO'].slice(3)){
				input_['INSUREDMOBILENO'].value = otherInfo['DRIVERMOBILENO'].slice(3);
				input_['DRIVERMOBILENO'].value = otherInfo['DRIVERMOBILENO'].slice(3);
			} 
		}else{
			input_['rdoInsMobileType'].click();
			if(otherInfo['DRIVERMOBILENO'].slice(0,3)) input_['INSUREDMOBILENOPREF_FOREIGN'].value = otherInfo['DRIVERMOBILENO'].slice(0,3);
			if(otherInfo['DRIVERMOBILENO'].slice(3)) input_['INSUREDMOBILENO_FOREIGN'].value = otherInfo['DRIVERMOBILENO'].slice(3);
		}
		//Vehicle Category
		if(otherInfo['Vehicle Category']) select_['selVehicleCategory'].value = otherInfo['Vehicle Category'];
		//Fleet Policy
		// if(policyPartTwo.policyNumber != ''){
		// 	document.getElementById("_rdoFleetPolicy1").click()
		// if(policyPartTwo.policyNumber) input_['txtPolicyNumber'].value = policyPartTwo.policyNumber;
		// }else{
		// 	document.getElementById("_rdoFleetPolicy0").click()
		// }

		//DRIVER
		if(otherInfo['Same As Insured Above']){
			setTimeout(function(){
				document.getElementById("chkBoxSameAsInsured").click();
			},300);
		} 
		//addressLine1 
		if(idCardBack.address) input_['DriverAddr1'].value = idCardBack.address;
		//补充
		let textarea_ = document.getElementsByTagName('textarea');
		if(otherInfo['circumstances']) textarea_['circumstances'].value = otherInfo['circumstances'];
		//性别
		idCardFront.sex == "M" ? document.getElementById("_rdoGenderM").click() : document.getElementById('_rdoGenderF').click();
		//number of vehicles
		if(otherInfo['sleNUMVEHACC']) input_['sleNUMVEHACC'].value = otherInfo['sleNUMVEHACC'];
		//number of passengers
		if(otherInfo['slePassanger']) input_['slePassanger'].value = otherInfo['slePassanger'];
		

		//weather
		document.getElementById(otherInfo['weather']).click()
		otherInfo['weather'] == '_rdoWeatherCondO' ? input_['txtWeatherDesc'].value = otherInfo['txtWeatherDesc'] : '';
		// otherInfo['weather'] == "_rdoWeatherCondC" ? document.getElementById("_rdoWeatherCondC").click() : otherInfo['weather'] == "_rdoWeatherCondR" ? document.getElementById("_rdoWeatherCondR").click() : document.getElementById("_rdoWeatherCondO").click() 
		//Road 
		document.getElementById(otherInfo['Road']).click()
		otherInfo['Road'] == '_rdoRoadSurfaceO' ? input_['txtRoadDesc'].value = otherInfo['txtRoadDesc'] : '';
		// otherInfo['Road'] == "_rdoRoadSurfaceW" ? document.getElementById("_rdoRoadSurfaceW").click() : otherInfo['Road'] == "_rdoRoadSurfaceD" ? document.getElementById("_rdoRoadSurfaceD").click() : document.getElementById("_rdoRoadSurfaceO").click() 
		document.getElementById(otherInfo['rdoInjury']).click();
		document.getElementById(otherInfo['rdoConveyHosp']).click();
		document.getElementById(otherInfo['rbFRVEH']).click();
		document.getElementById(otherInfo['rdoWitness']).click();
		document.getElementById(otherInfo['rdoDamage']).click();
		document.getElementById(otherInfo['rdoStrangers']).click();
		document.getElementById(otherInfo['rbCameraCap']).click();
		document.getElementById(otherInfo['rbAudioCap']).click();
		document.getElementById(otherInfo['rdoFleetPolicy']).click();
		document.getElementById(otherInfo['rbDRVOWNVEH']).click();
		//
		document.getElementById(otherInfo['rdoOwnPolicy']).click();
		if(otherInfo['selOwnPolicy ']) select_['selOwnPolicy'].value = otherInfo['selOwnPolicy ']
	} 
}


//发送请求
function getData_(){
    let data_ = {}
    let xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.responseType = "text";
    xhr.open('post','/serve',true);
    // @ts-ignore
    xhr.send(data_);
}

//页面加载完之后再执行
window.onload = function () {
    let url_ = window.location.href;
	if(url_.indexOf("caseId=") > 0){
		localStorage.clear()
	}
    // replaceDom_();
    switch(localStorage.getItem("state")){
        case null:
            case1();
            localStorage.setItem("state","2");
        break;
        case "2":
            case2()
        break;
        case "3":
            case3();
        break;
        case "4":
            case4();
		break;
		case "5":
			case5();
		break;
        default:
        break;
    }
}





