# VGP Amusement Park Booking System
## Backend Architecture (Version 1)

---

# Project Goal

Develop a production-ready online amusement park booking system with a clean architecture that is easy to maintain, extend, and scale.

Version 1 supports:

- Customer booking
- Ticket booking
- Meal booking
- Offers
- Coupons
- Online payment
- PDF ticket
- QR ticket
- Admin management

---

# Technology Stack

Backend

- Node.js
- Express.js

Database

- MySQL 8+

Authentication

- JWT

Validation

- Joi

Payment

- Razorpay

PDF

- PDFKit (Future)

QR

- qrcode (Future)

---

# Project Structure

backend/

```
src/

config/

constants/

controllers/

dto/

middlewares/

repositories/

booking/

catalog/

user/

routes/

services/

booking/

utils/

docs/
```

---

# Layer Responsibilities

## Controllers

Responsibilities

- Receive HTTP Request
- Validate request
- Call Service
- Return HTTP Response

Controllers NEVER

- Execute SQL
- Perform business logic
- Calculate prices

---

## Services

Services contain business logic.

Responsibilities

- Booking workflow
- Pricing
- Offers
- Coupons
- Payment
- Booking creation

Services NEVER

- Return HTTP
- Execute SQL directly

---

## Repositories

Repositories are responsible only for database access.

Responsibilities

- SELECT
- INSERT
- UPDATE
- DELETE

Repositories NEVER

- Perform business calculations
- Validate offers
- Generate booking numbers

Repositories always return

- Objects
- Arrays

Never return HTTP responses.

---

## DTO

DTOs transfer data between layers.

Current DTOs

BookingRequestDTO

PricingResultDTO

BookingResponseDTO

DTOs contain NO business logic.

---

## Utils

Reusable helper functions.

Examples

money.js

bookingNumberGenerator.js

Future

invoice.js

pdfGenerator.js

qrGenerator.js

---

# Booking Flow

Customer

↓

Frontend

↓

POST /booking

↓

Booking Controller

↓

Booking Service

↓

Pricing Engine

↓

Offer Engine

↓

Coupon Engine

↓

Booking Repository

↓

Booking Item Repository

↓

Booking Payment Repository

↓

Booking Response DTO

↓

Frontend

---

# Booking Workflow

1.

Receive Booking Request

↓

2.

Validate Request

↓

3.

Start Database Transaction

↓

4.

Generate Booking Number

↓

5.

Calculate Pricing

↓

6.

Apply Offer

↓

7.

Apply Coupon

↓

8.

Save Booking

↓

9.

Save Booking Items

↓

10.

Save Payment

↓

11.

Commit Transaction

↓

12.

Return BookingResponseDTO

---

# Pricing Engine Responsibilities

Responsible for

- Ticket subtotal
- Meal subtotal
- Taxes
- Convenience fee
- Visitor counts
- Invoice items

Never

- Apply offers
- Apply coupons
- Save booking

Returns

PricingResultDTO

---

# Offer Engine Responsibilities

Responsible for

- Offer validation
- Percentage offers
- Flat offers
- BUY_X_GET_Y offers

Never

- Execute SQL
- Save booking
- Handle coupons

Updates

PricingResultDTO

---

# Coupon Engine Responsibilities

Responsible for

- Coupon validation
- Coupon discount

Never

- Execute SQL
- Apply offers

Updates

PricingResultDTO

---

# Booking Service Responsibilities

BookingService orchestrates the complete booking.

Responsibilities

Generate Booking Number

↓

Pricing Engine

↓

Offer Engine

↓

Coupon Engine

↓

Repositories

↓

Commit Transaction

---

# Database Architecture

Tables

users

ticket_types

meal_types

offers

coupons

park_settings

bookings

booking_items

booking_payments

booking_sequences

---

# Booking Number Format

Frozen

VGP|DD|MM|YY|000001

Example

VGP290726000001

---

# Money Rules

All monetary calculations must use

utils/money.js

Example

roundMoney()

Never use floating-point calculations directly.

---

# Invoice Item Structure

Every invoice line uses

{
    itemType,
    itemId,
    itemCode,
    description,
    quantity,
    unitPrice,
    totalPrice
}

Item Types

TICKET

MEAL

TAX

FEE

DISCOUNT

---

# Offer Rules

Supported

PERCENTAGE

FLAT

BUY_X_GET_Y

Future

KIDS_FREE

BUY_X_GET_Y is completely data-driven.

Database controls

min_qty

free_qty

No hardcoded BOGO logic.

---

# Transaction Flow

BEGIN

↓

Generate Booking Number

↓

Pricing

↓

Offers

↓

Coupons

↓

Booking

↓

Booking Items

↓

Payment

↓

COMMIT

If any step fails

↓

ROLLBACK

---

# Coding Standards

Repositories

Return Objects/Arrays only.

Services

Contain business logic only.

Controllers

Handle HTTP only.

DTOs

Contain data only.

Utils

Contain reusable helpers only.

---

# Error Handling

Business validation

Return graceful responses.

System errors

Throw Error.

Database errors

Rollback transaction.

---

# Naming Convention

Repository

ticketRepository.js

mealRepository.js

Service

pricingEngine.js

offerEngine.js

couponEngine.js

bookingService.js

DTO

BookingRequestDTO

PricingResultDTO

BookingResponseDTO

---

# Future Enhancements

Capacity Management

Time Slots

Cancellation

Refund

Email Ticket

SMS Notification

Membership

Annual Pass

Dynamic Pricing

Multi-Park Support

Festival Pricing

---

# Frozen Architecture

This document defines the production architecture.

No architectural changes should be made unless a new business requirement requires them.

New modules must follow this document.