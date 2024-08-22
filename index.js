// const fs = require('fs');
// const path = require('path');

// Define the path to the test file
// const testPath = path.join("tf", "test.txt");

// console.log(testPath);

// Read content of the test file
// fs.readFile(testPath)
//  .then(data => console.log(data.toString()))
//  .catch(err => console.log(err.message))

// Aysnch operations -------------------
// const fs = require('fs').promises;
// fs.readdir(__dirname)
//     .then(files => {
//         return Promise.all(
//             files.map(async filename => {
//                 const stats = await fs.stat(filename);
//                 return {Name: filename, Size: stats.size, Date: stats.mtime, };
//             }),
//         );
//     })
//     .then(result => console.table(result));

// Interactive stdin/stdout
// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// console.log("Please type something");
// rl.pause();
// rl.on('line', cmd => {
//     console.log(`You just typed: ${cmd}`);
// });

// rl.question(`What's your name?`, answer => {
//     rl.pause();
//     console.log(`Nice to meet you ${answer}`);
//     rl.close();
// });

// Guess the number application, working great
// const readline = require('readline');
// const fs = require('fs').promises;
// const { program } = require('commander');
// require('colors'); // Corrected from 'color' to 'colors'

// program.option(
//     '-f, --file [type]',
//     'file for saving game results',
//     'results.txt',
// );
// program.parse(process.argv);

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// let count = 0;
// const logFile = program.opts().file;
// const mind = Math.floor(Math.random() * 10) + 1;

// const isValid = value => {
//     if (isNaN(value)) {
//         console.log(`Enter a number!`.red);
//         return false;
//     }
//     if (value < 1 || value > 10) {
//         console.log(`Number must be between 1 and 10`.red);
//         return false;
//     }
//     return true;
// };

// const log = async data => {
//     try {
//         await fs.appendFile(logFile, `${data}\n`);
//         console.log(`Succeeded in saving the result to file ${logFile}`.green);
//     } catch (err) {
//         console.log(`Failed to save file ${logFile}`.red);
//     }
// };

// const game = () => {
//     rl.question(
//         `Enter a number between 1 and 10 to guess: `.yellow,
//         value => {
//             let a = +value;
//             if (!isValid(a)) {
//                 game();
//                 return;
//             }
//             count += 1;
//             if (a === mind) {
//                 console.log(`Congratulations, you guessed the number in %d step(s)`.green, count);
//                 log(`${new Date().toLocaleDateString()}: Congratulations, you guessed the number in ${count} step(s)`)
//                     .finally(() => rl.close());
//                 return;
//             }
//             console.log(`You guessed it wrong, try again`.red);
//             game();
//         },
//     );
// };

// game();

const { Command } = require("commander");
const program = new Command();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts.js");

program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

// Function to invoke the appropriate action
async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      const contacts = await listContacts();
      console.log(contacts);
      break;

    case "get":
      const contact = await getContactById(id);
      if (contact) {
        console.log(contact);
      } else {
        console.log(`Contact with id ${id} not found`);
      }
      break;

    case "add":
      if (name && email && phone) {
        const newContact = await addContact(name, email, phone);
        console.log("Added new contact:", newContact);
      } else {
        console.log("Please provide name, email, and phone to add a contact.");
      }
      break;

    case "remove":
      const updatedContacts = await removeContact(id);
      console.log(`Removed contact with id ${id}. Updated contact list:`);
      console.log(updatedContacts);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

// Invoke the action based on command-line input
invokeAction(argv);

