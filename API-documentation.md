# APIs documentation

## authentication

- GET http://localhost:8080/auth/signup

- POST http://localhost:8080/auth/signup

    **body example**
        {
        "fullName":"mostafa abokhadra",
        "email": "mostafa@gmail.com",
        "password": "mostafa123",
        "confirmPassword": "mostafa123"
        }

- GET http://localhost:8080/auth/login

- POST http://localhost:8080/auth/login

    **body example**
    {
    "email": "mbukhadra@gmail.com",
    "password": "mostafa123",
    }

- GET http://localhost:8080/auth/google
- GET http://localhost:8080/auth/google/redirect
- POST http://localhost:8080/auth/logout

## post

- POST http://localhost:8080/:username/posts

    **body example**
        {
        "title": "e-commerce",
        "description": "i'm planning to work on an e-commerce project as it has so many customer in the market, i'm a frontend develpoer so i want 1 more front end develpoer with me, a UIUX designer and backend developers, who is ready to mingle?!",
        "roles": [{"role": "UIUX", "no": 1}, {"role": "backend Developer", "no": 3}],
        "repo": "https://github.com/sasa/masassa"
        }

- GET http://localhost:8080/:username/posts/
- GET http://localhost:8080/:username/posts/:postId
- PUT http://localhost:8080/:username/posts/:postId

    **body example**
        {
        "title": "e-commerce",
        "description": "i'm planning to work on an e-commerce project as it has so many customer in the market, i'm a frontend develpoer so i want 1 more front end develpoer with me, a UIUX designer and backend developers, who is ready to mingle?!",
        "roles": [{"role": "UIUX", "no": 1}, {"role": "backend Developer", "no": 3}],
        "repo": "https://github.com/sasa/masassa"
        }

- Delete http://localhost:8080/:username/posts/postId

## requests
- GET http://localhost:8080/:username/requests
- GET http://localhost:8080/:username/pending
- POST http://localhost:8080/:username/role/:roleId
- Delete http://localhost:8080/:username/requests/:requestId
