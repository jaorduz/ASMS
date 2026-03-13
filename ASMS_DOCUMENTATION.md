# ASMS — Advanced System for Meetings Support
## Comprehensive Documentation
### Javier Orduz
#### System: ASMS (Advanced System for Meetings Support)



[mywebsiteBDG]:https://img.shields.io/badge/website-jaorduz.github.io-0abeeb?style=plastic
[mywebsite]: https://jaorduz.github.io/

[mygithubBDG-jaorduz]: https://img.shields.io/badge/jaorduz-repos-blue?logo=github&label=jaorduz&style=plastic
[mygithub-jaorduz]: https://github.com/jaorduz/

[mygithubBDG-jaorduc]: https://img.shields.io/badge/jaorduc-repos-blue?logo=github&label=jaorduc&style=plastic 
[mygithub-jaorduc]: https://github.com/jaorduc/

[myXprofileBDG]: https://img.shields.io/static/v1?label=Follow&message=jaorduc&color=2ea44f&style=plastic&logo=X&logoColor=black
[myXprofile]:https://twitter.com/jaorduc


[![website - jaorduz.github.io][mywebsiteBDG]][mywebsite]
[![Github][mygithubBDG-jaorduz]][mygithub-jaorduz]
[![Github][mygithubBDG-jaorduc]][mygithub-jaorduc]
[![Follow @jaorduc][myXprofileBDG]][myXprofile]

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.11-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-stable-success)


---

# 1. Introduction

ASMS is an automation platform designed to support the organization of academic meetings such as:

- Conferences
- Research bootcamps
- Workshops
- Seminar series
- Speaker programs

The system is built entirely using Google Workspace infrastructure:

- Google Apps Script
- Google Sheets
- Google Forms
- Google Docs
- Google Drive
- Web Apps

ASMS automates many administrative tasks involved in organizing academic events including:

- Speaker invitations
- Speaker confirmations
- Program generation
- Conference website generation
- Certificates and badges
- Automated reminders

The goal of ASMS is to provide a **lightweight but powerful conference management infrastructure** without requiring external servers.

---

# 2. Core Architecture

ASMS uses a **central control panel architecture**.

One Apps Script project manages multiple events simultaneously.

System structure:

Drive
│
├ ASMS Control Panel
│   └ Apps Script
│
├ ASMS Events Registry
│
├ Event 1
│   ├ Spreadsheet
│   ├ Google Form
│   ├ Website
│   └ Event Folder
│
├ Event 2
│   ├ Spreadsheet
│   ├ Google Form
│   ├ Website
│   └ Event Folder

---

# 3. Event Lifecycle

Typical workflow for organizing an event using ASMS.

1. Install event
2. Add speakers to spreadsheet
3. Send invitation emails
4. Collect confirmations through Google Form
5. Generate conference schedule
6. Deploy conference website
7. Send session reminders
8. Generate certificates and badges

---

# 4. Spreadsheet Data Model

Each speaker corresponds to one row in the event spreadsheet.

Required columns:

speakerName  
speakerLastName  
email  
institution  
department  
speakerBio  
speakerPhoto  

TopicGral  
WhyThisTopic  

FocusA  
FocusB  
FocusC  
FocusD  

GuidingQuestionA  
GuidingQuestionB  
GuidingQuestionC  

LastingTalk  
DateTalk  
TimeStartTalk  
zoomLink  

speakerLinkedin  
speakerWebsite  

status  
confirmationStatus  
lastEmailSent  
lastReminderSent  
talkReminder7Sent  
letterRequested  

---

# 5. Major System Modules

ASMS is modular and organized into multiple files.

installer.js
Creates new event infrastructure

menu.gs
Adds the ASMS menu to the spreadsheet interface

data.gs
Reads spreadsheet data and converts rows to structured objects

utils.gs
Shared utility functions

email_templates.gs
HTML email templates

email_sender.gs
Handles sending invitation emails

reminders.gs
Automated reminder emails

calendar_utils.gs
Generates ICS calendar invitations

program_generator.gs
Builds conference program

badge.gs
Generates speaker badges with QR codes

certificate_generator.gs
Creates speaker certificates

speaker_webpage.gs
Generates speaker cards page

conference_website.gs
Generates full conference website

schedule_builder.js
Creates the automatic conference schedule

clone_event.js
Creates new events based on previous ones

event_registry.js
Stores metadata of all events

---

# 6. Automatic Conference Schedule Builder

The schedule builder reads all confirmed speakers and constructs a structured program.

Steps:

1. Filter confirmed speakers
2. Parse talk date and time
3. Sort sessions chronologically
4. Generate structured schedule
5. Export schedule to website and program

Schedule entries include:

- speaker
- talk title
- institution
- date
- time

---

# 7. Email System

ASMS separates email logic from email design.

Templates:
email_templates.gs

Sending logic:
email_sender.gs

Types of emails:

Speaker invitation  
Reminder emails  
Session reminders  
Confirmation messages

Emails are sent using GmailApp.

---

# 8. Speaker Confirmation System

ASMS automatically generates a Google Form used by speakers to confirm participation.

The form typically asks:

- confirmation (Yes / No / Need more information)
- request official invitation letter
- optional comments

Form responses automatically update the spreadsheet.

---

# 9. Conference Website Generator

ASMS can generate a complete conference website including:

Home section  
Program schedule  
Speaker cards  
Speaker bios

The website is generated dynamically using Apps Script Web Apps.

The site updates automatically when spreadsheet data changes.

---

# 10. Program Booklet Generator

ASMS can automatically generate a conference program document containing:

- schedule
- talk titles
- speaker information
- speaker biographies

The program is exported as HTML and can be converted to PDF.

---

# 11. Certificate Generator

Certificates are created using a Google Docs template.

Template placeholders:

{{NAME}}  
{{EVENT}}  
{{TITLE}}  
{{DATE}}

The script replaces these placeholders for each confirmed speaker.

Certificates can be exported as PDF.

---

# 12. Badge Generator

Speaker badges contain:

- speaker name
- event title
- QR code

The QR code links to:

- LinkedIn
- personal website
- institutional profile

Badges are generated using HTML and exported for printing.

---

# 13. Event Registry

ASMS maintains a central registry containing metadata about all events.

Registry columns:

eventName  
spreadsheetId  
formId  
folderId  
language  
created

The registry allows ASMS to manage multiple events simultaneously.

---

# 14. Development Workflow

ASMS development is done using:

GitHub  
VSCode  
CLASP

Typical workflow:

git add .  
git commit -m "update feature"  
git push  

clasp push

---

# 15. Testing Procedure

Recommended testing sequence:

1. Install event
2. Add test speakers
3. Send invitation
4. Confirm using Google Form
5. Generate schedule
6. Deploy website
7. Generate program
8. Generate certificates

---

# 16. Future Development

Potential improvements:

Conference analytics dashboard  
Speaker database  
Schedule conflict detection  
Automated website deployment  
AI‑generated speaker summaries

---

# 17. License

MIT License
