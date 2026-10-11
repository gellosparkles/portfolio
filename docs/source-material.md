# Source material (extracted from Internship_apps.zip)

The zip held four PDFs, extracted on 2026-10-11. This file covers only what could go on the site. Private details are left out on purpose: student ID, award amounts, payment schedule, visa or international status, and the certificate number.

## Identity
- English name: **Hansi Lee**. Legal/romanized name: **Tz-Jing Lee** (李子敬). The paper and the certificate use Tz-Jing.
- Currently: undergraduate at **USC Viterbi School of Engineering**.
- High school: **Kang Chiao International School, Linkou Campus** (Taiwan).

## Honors
- **CURVE Fellow, Fall 2026**: Center for Undergraduate Research in Viterbi Engineering, funded by the Puckett Research Fund (endowment). The award letter does not name the research topic.

## Certifications
- **Competency Certification in Generative AI Office Applications** (生成式AI辦公室應用能力認證), from the Institute for Information Industry (III, Taiwan). Issued 2026-07-23, expires 2028-07-22. The certificate has a QR code for verification.

## Research: Dynamic hand-gesture recognition (MobileNet + GRU)
- Title: *Regarding a MobileNet and GRU-based Dynamic Hand-Gesture Recognition Model*
- Authors: Peng-Ru Hou (Chang Gung Univ. EE), **Tz-Jing Lee** (Kang Chiao), Prof. Yeong-Hua Chang (Chang Gung Univ. EE)
- Submitted to the **20th Formosa Plastics Corp. Applied Technology Seminar**. The PDF is the English translation.
- Approach: a pre-trained MobileNet wrapped in TimeDistributed pulls spatial features from each frame, and a GRU (128 units) models how they change over time. Dropout is 0.3, then a softmax classifier. Hyperparameters were tuned with Optuna (TPE, 50 trials).
- Data: Kaggle "Hand Gesture Detection System" dataset with 763 clips of 30 frames each. Frames 7–26 were used, scaled down to 96×96. There are 5 classes: left swipe, right swipe, pause, thumbs down, thumbs up. The split is 643/90/30.
- Training: NVIDIA RTX 4060, about 15 minutes.
- **Result: 84.38% test accuracy, against 65.62% for the RNN+GRU baseline.** F1 was close to or at 1.0 for the pause and thumbs-up classes.
- Figures available: loss and accuracy curves, confusion matrices, model comparison chart.

## Project: ML Sudoku solver (engineering notebook)
- Built in Prof. Chang's lab, which is presumably the same Chang Gung lab.
- Hardware: AI Thinker ESP32-CAM in a LEGO enclosure, with an iPad as a backlit input surface. Image streaming over Wi-Fi was done in Arduino IDE.
- Stage 1: Edge Impulse transfer learning on MNIST reached about **94% F1** on single digits, deployed as an Arduino library.
- Stage 2: Edge Impulse object detection to read the whole grid. Accuracy dropped. Generative AI helped with labeling.
- Stage 3: digit recognition moved to Python so it could merge with the Python Sudoku-solving code. It currently checks a 3×3 grid against Sudoku rules.
- Status: a working prototype for single digits and partial grids, with a full-grid version planned.

## Gaps (not in the zip)
Most of these were later filled by the resume (below). Still missing: Khan Lab PI name and coursework.

## Resume (TzJing_Lee_Resume.pdf, added 2026-10-11)
Resume as "Tz-Jing (Hansi) Lee". It contains a phone number, so the PDF is git-ignored until publishing is approved.
- USC Viterbi B.S. ECE, Aug 2025 – **May 2029** (the user said 2028 in chat; see TODO), GPA 3.84, Dean's List Fall 2025–present, CURVE Fellow Fall 2026–present
- Contact: hansilee@usc.edu, linkedin.com/in/tzjinglee, Los Angeles
- Experience: Khan Lab USC (CURVE, Jan 2026–), III Cybersecurity Intern (Jun–Aug 2026, LLM ISO 27001 tool), YesTurnkey (May–Jul 2026, RPi WebRTC STUN/TURN), Hubl LLC co-founder (Nov 2025–, Buildathon 1st, Games Week 2nd, Greif Incubator), Chang Gung Univ. Intelligent Control Lab (Aug 2024–Jun 2025)
- Gesture paper: **presented as a poster** at the 20th Formosa seminar. The resume says "90%" accuracy but the paper says 84.38% (see TODO).
- Sudoku: original solver under 0.2 s per solve
