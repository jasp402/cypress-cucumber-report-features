# Cypress Cucumber Reporting Features

This report is born from the need to be able to count the scenarios within the feautres in a fast way without having to execute the automations.

> ⚠️This project is exclusive to users using cypress-summit-preprocessor.

## 🪛 How does it work?
 You must have [cypress](https://www.npmjs.com/package/cypress) installed, additionally you must use the [cypress-cucumber-preprocessor](https://www.npmjs.com/package/cypress-cucumber-preprocessor) library and the use of Features.
 This report tries to find all `.features` documents. When it finds it, it will store them temporarily for later analysis.


## 📦 Installation instructions
You can install the library via [npm](https://www.npmjs.com/) 
```
npm i cypress-cucumber-report-features
```

## 🔧 Use instructions
``` cmd
npx cypress-cucumber-report-features
```
![image](https://user-images.githubusercontent.com/8978470/194963336-cdca3c07-c00d-4974-9f5f-dcfe8f8daac0.png)

**Base:** Will create a folder with 4 files. Which contains a flat report with:

- Number of files Features
- Number of Features with Scenarios
- Total Number of Scenarios
- Base for the report in table format

**Table of Scenarios:** Generate a table of scenarios with the given number of features


## 🗃️ Results report
![image](https://user-images.githubusercontent.com/8978470/194964193-dd117cce-3937-4ccb-927d-d65bf3bb61c0.png)

> summaries-process.txt

![image](https://user-images.githubusercontent.com/8978470/194964415-4590a88e-cf23-42fd-a0b7-0b44bf4fff33.png)

## Contributor
Take a look at our document CONTRIBUTING.md to start configuring the repository. If you are looking for something to contribute. You can review our project in Trello You can also contact our channel Gitter if you have any questions about where to start contributing.