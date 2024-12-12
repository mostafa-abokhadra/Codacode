# APIs documentation

## authentication

- GET http://localhost:8080/auth/signup

- POST http://localhost:8080/auth/signup

    - **body example**
        ```json
        {
            "fullName":"mostafa abokhadra",
            "email": "mostafa@gmail.com",
            "password": "mostafa123",
            "confirmPassword": "mostafa123"
        }
        ```

- GET http://localhost:8080/auth/login

- POST http://localhost:8080/auth/login

    - **body example**
         ```json   
        {
            "email": "mbukhadra@gmail.com",
            "password": "mostafa123",
        }

        {
            "email": "ronaldo@gmail.com",
            "password": "ronaldo123"
        }

        {
            "email": "messi@gmail.com",
            "password": "messi123"
        }
                {
            "email": "momen@gmail.com",
            "password": "momen1123"
        }
         ```

- GET http://localhost:8080/auth/google
- GET http://localhost:8080/auth/google/redirect
- POST http://localhost:8080/auth/logout

## post

- POST http://localhost:8080/:username/posts

    - **body example**
        ```json
        {
            "title": "e-commerce",
            "description": "i'm planning to work on an e-commerce project as it has so many customer in the market, i'm a frontend develpoer so i want 1 more front end develpoer with me, a UIUX designer and backend developers, who is ready to mingle?!",
            "roles": [{"role": "UIUX", "no": 1}, {"role": "backend Developer", "no": 3}],
            "repo": "https://github.com/mostafa-abokhadra/Codacode"
        }

        {
            "title": "e-commerce",
            "description": "i'm planning to work on an e-commerce project as it has so many customer in the market, i'm a frontend develpoer so i want 1 more front end develpoer with me, a UIUX designer and backend developers, who is ready to mingle?!",
            "roles": [{"role": "UIUX", "no": 1}, {"role": "backend Developer", "no": 3}],
            "repo": "https://github.com/Mo2men-dev/pocket-doctor-client"
        ```

- GET http://localhost:8080/:username/posts/
- GET http://localhost:8080/:username/posts/:postId
- PUT http://localhost:8080/:username/posts/:postId

    - **body example**
        ```json
        {
            "title": "e-commerce",
            "description": "i'm planning to work on an e-commerce project as it has so many customer in the market, i'm a frontend develpoer so i want 1 more front end develpoer with me, a UIUX designer and backend developers, who is ready to mingle?!",
            "roles": [{"role": "UIUX", "no": 1}, {"role": "backend Developer", "no": 3}],
            "repo": "https://github.com/mostafa-abokhadra/Codacode"
        }
        ```

- Delete http://localhost:8080/:username/posts/postId

## requests
- GET http://localhost:8080/:username/requests
- GET http://localhost:8080/:username/pending
- POST http://localhost:8080/:username/role/:roleId
- Delete http://localhost:8080/:username/requests/:requestId
