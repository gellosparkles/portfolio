# To-do: content to fill in or verify

Each item says what the site shows now. Most edits go in `src/content/site.ts`.

## Conflicts between the resume and the site (decide these first)
- [ ] **Graduation year**: you told me 2028, but the resume says May 2029. The site shows "Expected 2028" (`site.graduation` plus the USC entry in `education`). Make the site and the resume agree.
- [ ] **Gesture accuracy**: the resume says "90%", but the paper reports 84.38% test accuracy. The site uses 84.38% because it matches the paper's confusion matrices. Change the resume to match, or explain where 90% came from (e.g. validation accuracy).
- [ ] **Resume typo**: the resume says "USC Marshall **Grief** Incubator". The incubator is the **Greif** Incubator (Lloyd Greif Center), and the site spells it that way. Fix the resume.
- [ ] **Publishing the resume PDF**: it includes your phone number. To publish it, copy it to `public/resume.pdf` (a version without the phone number is safer) and set `site.links.resume = "/resume.pdf"`. Until then the Resume buttons stay hidden.

## Missing (the site hides these until they're filled)
- [ ] **Khan Lab advisor / PI name**: the site says "Khan Lab, USC" only.
- [ ] **Hackathon years**: shown as "2025–26".
- [ ] **Internship season**: the hero says "Seeking Summer 2027 internships". Change it if that's wrong.
- [ ] **Other projects, work experience, relevant coursework**: add them to `src/content/projects.ts` or `site.ts`.
- [ ] **Custom domain**: follow the README section "Adding your domain", then set `NEXT_PUBLIC_SITE_URL`.

## Shown as the documents state, still unverified
- [ ] **GitHub link**: set to `github.com/gellosparkles`, the account the gh CLI on this machine is signed into. Confirm that's the one you want public.
- [x] **Paper status**: the resume confirms it was presented as a poster. The site now says so.
- [ ] **Paper PDF**: not hosted. If the co-authors (Peng-Ru Hou, Prof. Yeong-Hua Chang) agree, add it as `public/papers/gesture-recognition.pdf` and set `paperPdf` in `src/content/site.ts`.
- [ ] **Your role on the paper**: the site says you researched architectures, co-wrote the paper and presented the poster, following the resume. Correct it if your role differed.
- [ ] **Test-set size**: the paper's text says 30 test clips (643/90/30), but both confusion matrices add up to 32. The site uses 32 because it matches the reported 84.38% (27/32) and 65.62% (21/32). Worth a double-check.
- [x] **Research timeline and lab**: the resume gives Aug 2024 – Jun 2025, Chang Gung University Intelligent Control Lab.
- [ ] **Framework**: the site lists TensorFlow/Keras, inferred from `TimeDistributed` + MobileNet. Confirm.
- [ ] **Certificate verification**: listed with issuer and dates only. Add the verification URL if III gives one (`certifications[].url`).
