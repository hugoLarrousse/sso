# Routes

*updated the 19/11/2022 by Hugo LARROUSSE*

## /o/oauth2/v2/

 TODO

## others

* GET /favicon.ico
  * return favicon
* GET /
  * fallback
* ALL *
  * fallback

# Response

## 200
  OK
  object | object[]

## 400
  error
  ```
    error: BOOLEAN,
    errorType: STRING,
    errorSubType?: STRING,
    errorSubTypes?: STRING[],
    message: STRING
  ```

## 403
  forbidden
  ```
    error: BOOLEAN,
    errorType: STRING,
    message: STRING
  ```