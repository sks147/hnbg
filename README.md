# HNBG

## Steps to run the application

* `git clone https://github.com/sks147/hnbg.git`
* `cd hnbg`
* `npm install`
* `npm run dev`

## API examples

For authenticating and getting user information `x-auth-token` is required in requests.

> Register New user
![Register New User](/images/reg_user.png)

---

> Get User Info by token
![Get User Info by token](/images/get_user_by_token.png)

---

> Authenticate User
![Authenticate User](/images/authenticate_user.png)

---

> Create/Update User Profile
![Create/Update User Profile](/images/upsert_profile.png)

---

> Get Logged in User Profile
![Get Logged in User Profile](/images/get_profile.png)

---

> Get All articles
* Fetches the top 90 articles from Hackernews API.
* Updates or creates the articles in the Database.
![Get All articles](/images/get_all_articles.png)

---

> Get Individual Article
![Get Individual Article](/images/read_article.png)

---

> Sample UI
![Sample UI](/images/sample_ui.png)

---

> Mark Article as Read
* Adds the current article to the read_articles list in user profile
* By clicking on `Mark As Read` Button we can call the api to read article api
* In frontend we can check if the article is present in read_articles list we can show it as read
![Mark Article as Read](/images/read_article.png)

---

> Delete the Article for Logged in User Profile
* Adds the current article to the deleted_articles list in user profile
* By clicking on `Delete` Button we can call the api to delete article api
* In frontend we can check if the article is present in deleted_articles list we can hide it from user
![Delete the Article for Logged in User Profile](/images/delete_article.png)

> Postman Collection

![Postman Collection](hnbg.postman_collection.json)
