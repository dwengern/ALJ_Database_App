# Final Project Report

## 1. Requirements Specifications

    Feature: Searching the database

        Scenario: User searches for a shipname
            Given: A user enters the name of a ship into the input field,
            When: The user presses the submit button and searches,
            Then: A list of all the conversations about that ship are displayed.
        
        Scenario: User searches for a ship that doesn't exist
            Given: A user enters the name of a ship that isn't in the database,
            When: The user presses the submit button and searches,
            Then: An error message will appear stating no results exist.
    
    Feature: Managing conversations

        Scenario: A user tries to create a chat
            Given: A user hits the create chat button,
            When: They enter the chat description, chat name, and the ship it is about,
            Then: The conversation will be added to the database.

        Scenario: A user needs to see their conversations
            Given: A user wants to see the chats he owns,
            When: They click on the conversation tab,
            Then: A list of all the chats they own will be displayed.

        Scenario: A user wants to interact with a chat
            Given: A user clicks on the link of a conversation,
            When: They are directed to a unique chat page,
            Then: They are able to view the chat and add comments.

        Scenario: A user wants to add participants to a chat
            Given: A user wants to add another user to a conversation,
            When: They click add participant on the chat's page,
            Then: They are able to add that user based on their user ID.

## 2. System Overview

The first feature from the list above that I implemented was the search feature. In order to do that I had to write a Python script that uploaded the data from the ALJ 2020 Database and into the Firestore database.  After that was achieved I was then able to create a search query in which the user will input the name of the ship they want to see conversations about.  I use a reactive block in my code that updates everytime the searchQuery is changed.  This allows the user to type in a ship name and the query will return whatever ships contain the letters in the search query.  If conversations are found, the query returns the converstaions that about the ship.  This includes every conversations about that ship, not just ones that are owned by the user. To search for the ships it uses the searchChatsByShipName function in order to look through the collections in the cloud firestore, it looks to see if the object has a matching shipName property, and it returns those ships in the database. 

The other feature that I implemented was the conversations feature.  In order to do that I had to first start by importing that firestore database so that we are able to look through collections and add documetns to them.  On mount, the program loads the conversations from the database into the application.  This will allow us to pull conversations once they are added and then display them to the user.  When the user presses the create chat button they are given popups to give the chat a name, a description, and the shipName that they conversation is about.  Once they create the conversation, it is uploaded to the cloud firestore database in a conversations collection.  When the user clicks on the link to the conversation they are pulled to a specialized page for that specific conversation, and they are able to see all the information about the conversation.  If they own the chat, they are also able to add participants by getting a users unique ID and adding them to the conversation object as a participant.  Users can also add comments which are timestamped, show the user's username, and the actual body of the comment itself.

My sequence diagrams are including in the docs directory with this report.