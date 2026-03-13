# ASMS — Advanced System for Meetings Support
### Javier Orduz


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

<!-- [![DOI](https://zenodo.org/badge/1170277309.svg)](https://doi.org/10.5281/zenodo.18838613) -->



---

<p style="text-align:right; font-family:verdana;"><a href="mywebsiteBDG" style="color:#3364ff; text-decoration:none;">@Javier Orduz</a></p>    
---


ASMS is a lightweight conference and academic event automation system built on **Google Apps Script, Google Sheets, and Google Workspace**.

The system automates key tasks required to organize academic events such as:

- research bootcamps
- workshops
- conferences
- seminar series
- speaker programs

ASMS allows organizers to manage **multiple events simultaneously** from a single control panel.

---

# Key Features

## Event Automation
ASMS automatically generates the infrastructure required to run an academic event:

- event spreadsheet
- speaker confirmation form
- event folder structure
- event registry
- automated email invitations
- reminder emails

---

## Speaker Management

Each speaker is stored as a row in the event spreadsheet.

Typical fields include:

- speaker name
- institution
- talk title
- talk description
- session date
- session time
- session duration
- speaker bio
- speaker photo

This data powers the entire system.

---

## Automatic Schedule Builder

ASMS generates a structured conference schedule automatically from the spreadsheet.

The schedule can be reused for:

- conference website
- program booklet
- session reminders
- calendar invites

---

## Speaker Website Generator

ASMS can generate a conference website displaying:

- speaker cards
- session schedule
- speaker bios
- institutional affiliations

The website is served through **Google Apps Script Web Apps**.

---

## Program Booklet Generator

ASMS can automatically create a program document containing:

- conference schedule
- detailed talk descriptions
- speaker biographies

The program can be exported as HTML or converted to PDF.

---

## Certificate Generator

Certificates of participation for speakers can be generated automatically using a **Google Docs template**.

Certificates include:

- speaker name
- event name
- talk title
- event date

---

## Speaker Badge Generator

ASMS generates speaker badges including:

- name
- event title
- QR code linking to social media or personal website

Badges can be exported for printing.

---

# Architecture Overview

ASMS follows a **central control panel architecture**.

ASMS Control Panel
│
├ Event Registry
│
├ Event A
│ ├ Spreadsheet
│ ├ Google Form
│ └ Website
│
└ Event B
├ Spreadsheet
├ Google Form
└ Website

The control panel manages all events using a shared Apps Script project.

---

# Event Registry

ASMS maintains a central **Event Registry** containing metadata about all events.

Example:

| eventName | spreadsheetId | formId | folderId | language | created |
|---|---|---|---|---|---|
Research Bootcamp | ... | ... | ... | EN | 2026-03-12 |

This registry allows ASMS to manage multiple conferences simultaneously.

---

# Event Lifecycle

Typical workflow for organizing an event using ASMS:

1. Install event
2. Add speakers to spreadsheet
3. Send invitations
4. Collect confirmations
5. Generate program
6. Deploy conference website
7. Send session reminders
8. Generate certificates and badges

---

# Installation

1. Install Node.js
2. Install CLASP

```bash
npm install -g @google/clasp
```

3. Login

clasp login

4. Clone repository

```bash
git clone https://github.com/your-repo/asms.git
```

5. Push project to Apps Script

clasp push

---

# Running ASMS

Open the control panel spreadsheet.

Use the **ASMS menu** to run commands:

ASMS
├ Install Event
├ Clone Event
├ Select Event
├ Send Invitations
├ Send Reminders
├ Generate Program
├ Generate Certificates
├ Generate Badges
└ Preview Website

---

# Example Use Cases

ASMS is suitable for:

- academic conferences
- research accelerators
- speaker series
- institutional seminars
- interdisciplinary workshops

---

# Technology Stack

ASMS is built entirely on Google Workspace tools:

- Google Apps Script
- Google Sheets
- Google Forms
- Google Docs
- Google Drive
- Google Web Apps

---

# Roadmap

Future planned features include:

- Event Manager dashboard
- schedule conflict detection
- automated website deployment
- multi-event conference portal
- speaker analytics

---

# License

MIT License