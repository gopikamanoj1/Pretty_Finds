const form = document.getElementById('form');
const username = document.getElementById('name');
const email = document.getElementById('email');
const mobile=document.getElementById('mno');
const password = document.getElementById('password');


form.addEventListener("submit", e => {
        validateInputs();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    // inputControl.classList.add('success');
    inputControl.classList.remove('error');
    if (document.querySelectorAll('.success').length === 4) {
        form.submit(); 
    }
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const mobileValue=mobile.value.trim();
    const passwordValue = password.value.trim();
    
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(usernameValue === '') {
        setError(username, 'Name is required');
    }else if(/\d/.test(usernameValue)){
        setError(username, 'Name cannot contain numbers!');
    }else if(specialChars.test(usernameValue)){
        setError(username, 'Name cannot contain spectial characters!');
    }else {
        setSuccess(username);
    }

    if(emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }


    if (mobileValue=="" || mobileValue==null) {
        setError(mobile, 'Phone cannot be Blank!');
    }else if (isNaN(mobileValue)){
        setError(mobile, 'Phone cannot contain letters!');
    }else if (mobileValue.length<10 || mobileValue.length>10){
        setError(mobile, 'Phone must contain 10 digits..');
    }else{
        setSuccess(mobile);
    }


    if(passwordValue === '') {
        setError(password, 'Password is required');
    } else if (passwordValue.length < 8 ) {
        setError(password, 'Password must be at least 8 character.')
    } else {
        setSuccess(password);
    }

};   


