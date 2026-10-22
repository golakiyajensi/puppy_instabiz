# AI Prompts Used

This project was built with **Claude (Claude Code)** working inside the project folder. Claude wrote files directly; I gave the direction and made the decisions below. This file lists the prompts that shaped the project, in order.

<!-- Replace or extend this list with your own wording if you used other prompts. It should reflect what you really asked. -->

## 1. Master prompt (the assignment)

The assignment text was given to the assistant as it came from the company:

```
Reference Website: https://puppy.instabizweb.com/

Requirements:
Build a complete clone of the reference website, matching its design, layout,
responsiveness, and functionality as closely as possible.
```

On top of that I added these instructions (summarised):

- Use **Node.js, Express.js, React and Tailwind CSS**, with **MySQL** as the database.

- Put everything in the `Submission` folder.

## 2. README template

I shared the company's README template, and asked for the project structure (`client/`, `server/`, `database/schema.sql`, `PROMPTS.md`, `.env.example`) and the README sections to follow it.

## 3. Decisions I made when asked

| Question from the assistant | My answer |
| --- | --- |
| Where should the puppy photos come from? | Download the reference photos into the project |


## 4. Follow-up prompts during development (summarised)

1. Study the reference site page by page (home, puppies, a puppy page, gone home, happy families, how it works, FAQ, contact), including its scroll animations, fonts, colours and mobile layout.
2. Design the MySQL schema (breeds, puppies, images, FAQs, testimonials, family photos, journey steps, trust points, settings, enquiries, contact messages) and write the seed data from the reference content.
3. Build the Express REST API with validation, error handling, rate limiting and a spam trap, and a one-command database setup script.
4. Build the React pages and components with Tailwind CSS, matching the reference visually, then compare screenshots of the reference and the clone at desktop and phone widths and fix the differences.
5. Make it responsive, keyboard accessible, and respectful of reduced-motion settings.
6. Write the README, `.env.example` files and this file.
