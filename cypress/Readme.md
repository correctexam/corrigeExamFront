# How to run e2e testing for correctexam


1. Clone the back and the front you want to test. 

2. Start the back in the teste2e profil

```bash
./mvnw -Pteste2e
```


3. Start the front

```bash
npm run start
```


4. In the front folder, you can easily run all the tests

```bash
npm run cy:run
```


5. If you need to interact with cypress studio (optional)

```bash
npx cypress open
```


