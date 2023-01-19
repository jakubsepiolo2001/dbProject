# FilmSave

This is a small project that is designed to pull films from a database, which a logged in user is able to add to their profile, they can then mark the film as watched and leave a score. Films can be added and deleted to and from the database and users can remove films they've added to their profile.


# Usage

 - Clone the repository `git clone https://github.com/jakubsepiolo2001/dbProject`
 - Run `npm install` to ensure you have all required packages
 - Setup a MongoDB database and using the provided NetflixOriginals.csv file import it to your database by running the following comannd `mongoimport --uri mongodb+srv://<username>:<password>@cluster0.em7ecxj.mongodb.net/films --collection films --type csv --headerline --file NetflixOriginals.csv ` This will require mongoimport binaries which can be found [here](https://www.mongodb.com/docs/v3.2/reference/program/mongoimport/)
 - Edit the .env file to contain your database credentials
 - Running the application using `npm run start` this will run the application in in production mode, while running the application using `npm run dev` will run the application in development mode

 

## Process

 - Visit the page by going to `localhost:2020` by default, unless this has been changed
 - There are no users by default, so you will not have an admin user, to set an admin user after registering manually edit the `admin` property in the user document of your database to `true`
 - You should be able to use the website's functionality upon logging in with valid user credentials