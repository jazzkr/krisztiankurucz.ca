---
title: 'Contact Me'
heading: 'Contact Me'
subheading: 'Have questions? Reach out!'
image: contact-bg.jpg
form:
    name: main-contact-form
    fields:
        -
            name: name
            label: Name
            placeholder: 'Enter your name'
            autocomplete: 'on'
            type: text
            validate:
                required: true
        -
            name: email
            label: Email
            placeholder: 'Enter your email address'
            autocomplete: 'on'
            type: email
            validate:
                required: true
        -
            name: subject
            label: Subject
            placeholder: 'Enter the subject'
            type: text
            validate:
                required: true
        -
            name: message
            label: Message
            placeholder: 'Enter your message'
            type: textarea
            validate:
                required: true
    buttons:
        -
            type: submit
            value: Submit
        -
            type: reset
            value: Reset
    process:
        -
            email:
                from: '{{ form.value.email }}'
                to: '{{ config.plugins.email.to }}'
                subject: '{{ form.value.subject }}'
                body: '{% include ''forms/data.html.twig'' %}'
        -
            message: 'Thank you for reaching out!'
        -
            display: thankyou
---

---

### Send Me A Message Here
Feel free to drop me a line via the form below and I'll get back to you as soon as possible!