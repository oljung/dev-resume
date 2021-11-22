const sendMail = contactForm => {
    emailjs.send("service_9li8xis","template_5y3p3h6", {
        'from_name': contactForm.name.value,
        'from_email': contactForm.email.value,
        'project_request': contactForm.projectsummary.value
    })
    .then(
        response => {
            console.log('SUCCESS', response);
        },
        error => {
            console.log('ERROR', error);
        }
    )
}