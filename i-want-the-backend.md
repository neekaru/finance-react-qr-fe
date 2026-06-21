# Backend Requirements

## Auth

`POST /auth/register`
- Body: `{ name, email, password }`
- Response: `{ token, user: { id, name, email } }`

`POST /auth/login`
- Body: `{ email, password }`
- Response: `{ token, user: { id, name, email } }`

All other endpoints require `Authorization: Bearer <token>`.

## Transactions

`GET /transactions`
- Query: `?type=income|expense&from=ISO&to=ISO&page=1&limit=20`
- Response: `{ data: Transaction[], total, page, pages }`

`POST /transactions`
- Body: `{ type, category, note, amount, date, icon? }`
- Response: `{ id, ... }`

`DELETE /transactions/:id`
- Response: `204`

## Balance

`GET /balance`
- Response: `{ total, income, expense, monthIncome, monthExpense }`

## Barcode Lookup

`POST /scan`
- Body: `{ barcode }` or multipart image upload
- Response: `{ name, price, category, icon }` — product from catalog or OCR extraction
- Fallback: `404` when barcode not found (frontend shows manual input)

## Weekly Recap

`GET /recap/weekly`
- Query: `?weekStart=ISO`
- Response: `{ weekStart, weekEnd, income, expense, topCategory: { category, amount }, days: [{ label, expense, income, count }] }`

## Achievements

`GET /achievements`
- Response: `{ level: string, xp: number, badges: Achievement[] }`

Achievement object:
```json
{ "id": "string", "title": "string", "desc": "string", "status": "unlocked|progress|locked", "progress": 0.0-1.0 }
```

Progress and unlocks are computed server-side based on user activity (streak days, total transactions, balance thresholds, category counts).

## Gallery

`GET /gallery`
- Response: `GalleryItem[]`

Gallery items are transaction highlights — largest income, largest expense, category streaks, milestones. Computed server-side.

## Data Shape

```ts
type Transaction = {
  id: string
  type: "income" | "expense"
  category: string
  note: string
  amount: number
  date: string  // ISO 8601
  icon: string   // "coffee" | "cart" | "food" | "salary" | "gift" | "transport" | "entertainment" | "wallet"
}
```

All amounts in Rupiah (integer, no decimals). Dates in ISO 8601 with timezone.

## Non-functional

- REST JSON. Rate-limit auth endpoints. Paginate lists (default 20).
- Indonesian Rupiah amounts — store as integers.
- Achievement progress recomputed on transaction write (event-driven or scheduled).