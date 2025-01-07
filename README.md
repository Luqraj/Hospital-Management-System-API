#HOSPITAL MANAGEMENT SYSTEM API (HMS-API)

HMS-API  is a RESTful API built with node.js, express and PostgreSQL. This API provides essential features of CRUD operations for doctors, patients, appointments, prescriptions and bills. It also allows for user accounts management and authentication.

##Features

* Register for an account by providing a/an name, password and email
* Log in with email and password and an issued token

Sequel to logging in based on the defined role, **receptionists** can:

* Perform all CRUD operations on doctors, patients, appointments, prescriptions and bills except that:

1. They can't update and delete patients' and doctors' details
2. They can't update and delete a bill
3. They can't cancel, reschedule and delete an appointment

The three afore-mentioned tasks above could only be perfomed by an **admin**

Non-account holders are not privileged to perform any task.

###Prerequisites

* Node.js
* Express
* PostgreSQL
* Prisma ORM