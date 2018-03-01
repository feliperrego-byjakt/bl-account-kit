var API_URL;

if (window.location.hostname == "localhost") {
    API_URL = 'http://localhost:8000';
} else {
    API_URL = 'https://bikelane-api.herokuapp.com';
}

function signupMethod(method) {
    if (method=='email') {
        $('.email-group').show();
        $('.phone-group').hide();
        $('.email-method').hide();
        $('.phone-method').show();
        $('#email').attr('disabled', false);
        $('#phone_number').attr('disabled', true);
        $('.submit-email').show();
        $('.submit-sms').hide();
    } else {
        $('.email-group').hide();
        $('.phone-group').show();
        $('.email-method').show();
        $('.phone-method').hide();
        $('#email').attr('disabled', true);
        $('#phone_number').attr('disabled', false);
        $('.submit-email').hide();
        $('.submit-sms').show();
    }
}

// login callback
function loginCallback(response) {
    if (response.status === "PARTIALLY_AUTHENTICATED") {
        document.getElementById("code").value = response.code;
        console.log(response.code);
        showOverlay('Registering user...');

        setTimeout(function () {
            submitForm()
        }, 1000);
    }
    else if (response.status === "NOT_AUTHENTICATED") {
        // handle not authenticated
        hideOverlay();
        alert('An error occured, handle this. Status: ' + response.status);
    }
    else if (response.status === "BAD_PARAMS") {
        // handle bad parameters
        hideOverlay();
        alert('An error occured, handle this. Status: ' + response.status);
    } else {
        console.log(response.status);
    }
}

// phone form submission handler
function smsLogin() {
    var phoneNumber = $('#phone_number').val();
    var countryCode = $('#country_code').val();
    showOverlay('Please, go to validation screen!');
    AccountKit.login(
        'PHONE',
        { countryCode: countryCode, phoneNumber: phoneNumber }, // will use default values if not specified
        loginCallback
    );
}

// email form submission handler
function emailLogin() {
    var email = $('#email').val();
    showOverlay('Please, go to validation screen!');
    AccountKit.login(
        'EMAIL',
        { emailAddress: email },
        loginCallback
    );
}

function showOverlay(message) {
    $('.block-msg h1').text(message);
    $('.block').show();
}

function hideOverlay() {
    $('.block').hide();
}

function submitForm() {

    hideErrors();    

    showOverlay('Please wait...');

    var data = $('#signup-form').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    $.ajax({
        method: 'POST',
        url: API_URL + '/api/auth/registration/',
        data: data
    })
        .done(function (response) {
            setTimeout(function () {
                $('#signup-form').hide();
                $('#page-title').text('Registration completed!');

                hideOverlay();
            }, 1000);
        })
        .fail(function (err) {
            showErrors(err.responseJSON.errors);
        });

}

function hideErrors() {
    $('.errors').empty();
}

function showErrors(errors) {
    var $errors = $('.errors');

    $errors.empty();
    errors.map(function (error) {
        $errors.append('<div class="alert alert-danger" role="alert">' + error.message + '</div>');
    });

    hideOverlay();
};

$(document).ready(function(){
    signupMethod();

    $('.email-method').click(function(event) {
        event.preventDefault();
        signupMethod('email');
    });
    
    $('.phone-method').click(function(event) {
        event.preventDefault();
        signupMethod();
    });
})