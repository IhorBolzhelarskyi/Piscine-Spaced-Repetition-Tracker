**Spaced-Repetition-Tracker**

This project implements a spaced repetition learning technique, which involves reviewing topics over increasing time intervals (e.g., after one week, one month, three months, six months, and one year) from a selected date. The start date for the learning task can be chosen from the past, present, or future.
The goal is to help users track which topics need revision and when.

**Features**
Topic Tracking: Users can add topics they want to revise.
Revision Schedule: The system calculates and displays the revision dates based on spaced repetition intervals.
Agenda Display: A simple frontend built with HTML and JavaScript shows an agenda of topics to revise on specific dates.

**Technologies**
HTML: Used for the structure of the project.
JavaScript: Used for functionality, including date calculations, user interaction, and data storage.
localStorage: Used to store the user data locally in the browser.
Jest: Used for unit testing to ensure the core functionality works as expected.

**Set up & Installation**
Clone the repository
git clone <https://github.com/IhorBolzhelarskyi/Piscine-Spaced-Repetition-Tracker>
Navigate into the project folder (if needed)
 cd spaced-repetition-tracker
Open index.html in your browser
Ensure the project is served over HTTP for the module system to work. Learn to serve over HTTP.
Running tests
Make sure you have Node.js installed before running the tests.
Install dependencies:
npm install
Run Unit Tests:
npm test
This will run the tests using Jest.
Check the Test Results:
The test results will be displayed in the terminal.
Usage
Open the application in your browser.
Select a user from the dropdown to view their study agenda.
Add a new topic with a start date.
The app will calculate and display review dates based on spaced repetition intervals.

**Notes**
This project focuses on logic implementation, so no CSS is used for styling.
The frontend is kept simple to emphasize functionality over design.

**Contributions**
Contributions are welcome. If you find any bugs or want to improve the project, feel free to fork the repo, make your changes, and submit a pull request.
