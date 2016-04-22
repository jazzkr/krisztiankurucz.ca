---
title: Contact Me
menu: Contact
form:
    name: main-contact-form
    fields:
        - name: name
          label: Name
          placeholder: Enter your name
          autofocus: on
          autocomplete: on
          type: text
          size: medium
          validate:
            required: true

        - name: email
          label: Email
          placeholder: Enter your email address
          type: email
          size: long
          validate:
            required: true

        - name: purpose
          label: Which best describes you?
          type: select
          size: long
          options:
            Musician4OpenMic: I am a musician interested in playing at an open mic
            Looking4Representation: I am a musician looking for representation
            Venue: I represent a venue interested in having an open mic night
            Vendor: I am/represent a vendor interested in retail space
            Other: Other

        - name: message
          label: Message
          size: long
          placeholder: Enter your message
          type: textarea
          validate:
            required: true

    buttons:
        - type: submit
          value: Submit
        - type: reset
          value: Reset

    process:
        - email:
            from: "{{ config.plugins.email.from }}"
            to: "{{ config.plugins.email.to }}"
            subject: "[{{ form.value.purpose }}] {{ form.value.name|e }}"
            body: "{% include 'forms/data.html.twig' %}"
        - save:
            fileprefix: ""
            dateformat: Ymd-His-u
            extension: txt
            body: "{% include 'forms/data.txt.twig' %}"
        - message: Thank you for reaching out!
        - display: thankyou
---

Are you a musician looking to jam? A venue looking for some talented local artists? A local trying to find the best nightlife in York Region? Feel free to drop us a line!
