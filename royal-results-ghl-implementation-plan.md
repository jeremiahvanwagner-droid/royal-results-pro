# Royal Results Pro — GHL CRM Integration: Full Implementation Plan

**Repository:** `jeremiahvanwagner-droid/royal-results-pro`  
**Website:** `https://royalresults.pro`  
**GHL Sub-Account:** Royal Results — Location ID `0PFDiGrgne4sbE4dJEC6`  
**Objective:** Keep the existing website UI exactly as-is and route all "Let's Connect" form submissions to GoHighLevel as the CRM, with contact creation, notes, opportunity pipeline, and automation.

---

## Executive Summary

The website already has a fully wired React → tRPC → Express form pipeline. The `server/routers.ts` contact mutation already hits the GHL v2 LeadConnector API. However, three bugs are preventing data from landing correctly in GHL, and two features (opportunity creation, GHL automations) have not been built yet. This plan covers every code change, every GHL-side configuration step, every environment variable, and the full end-to-end test procedure — organized in precise execution order.

---

## System Architecture (Current State)

```
[User fills ContactSection.tsx form]
          ↓
[React state + onSubmit handler]
          ↓
[trpc.contact.submit.useMutation()]
          ↓
[tRPC HTTP call to Express server]
          ↓
[server/routers.ts → contact.submit mutation]
          ↓  (currently broken — 3 bugs)
[LeadConnector API v2]
          ↓
[GHL Contact Record]
          ↓  (missing — not yet built)
[GHL Contact Note]   [GHL Opportunity]   [GHL Workflow Automation]
```

---

## Bugs Found in Current Code

### Bug 1 — `customField` Uses a Placeholder ID (CRITICAL)

**Location:** `server/routers.ts` line ~84–89

**Current broken code:**
```typescript
customField: [
  {
    id: "service_interest",        // ← plain string, NOT a real GHL field ID
    field_value: input.service || "",
  },
],
```

**Why it breaks:** GHL's Contacts API requires the internal UUID or exact `key` of a custom field as defined in your sub-account settings. The string `"service_interest"` does not match any real field in location `0PFDiGrgne4sbE4dJEC6`, causing either a silent ignore or an API 400 error on every submission.

**Fix:** Remove the `customField` block entirely from the contact create payload. The service interest is already captured in the `tags` array and will be written to the contact note — no data is lost.

---

### Bug 2 — Note Creation Sends Wrong Field (`userId` instead of `contactId`) (CRITICAL)

**Location:** `server/routers.ts` line ~107

**Current broken code:**
```typescript
body: JSON.stringify({
    userId: contactId,   // ← WRONG FIELD NAME
    body: noteText,
}),
```

**Why it breaks:** The GHL v2 Notes API (`POST /contacts/{contactId}/notes`) requires the body field to be `contactId`, not `userId`. This means every note silently fails to save — the form submission appears to succeed from the user's perspective but no note ever appears in GHL.

**Fix:** Replace `userId: contactId` with `contactId: contactId`.

---

### Bug 3 — Note Errors Are Silently Swallowed (MODERATE)

**Current broken code:**
```typescript
.catch(err => console.error("Failed to add note:", err));
```

**Why it breaks:** The note fetch is only `.catch`-ing on network/throw errors. Non-OK HTTP responses (4xx, 5xx) from GHL are never checked. You will never know if notes fail with an auth error, rate limit, or malformed payload.

**Fix:** Add a `.then(async noteRes => { if (!noteRes.ok) { ... } })` chain before the `.catch`.

---

### Bug 4 — `contactId` Extraction Assumes One Response Shape (LOW)

**Current code:**
```typescript
const contactId = contactData?.contact?.id;
```

**Why it's risky:** GHL's API can return either `{ contact: { id: "..." } }` or `{ id: "..." }` depending on whether the contact was created new vs. merged with an existing record. If the shape differs, `contactId` is `undefined` and the note never fires — but the mutation returns `{ success: true }` anyway, hiding the failure.

**Fix:** Use `contactData?.contact?.id ?? contactData?.id` and throw an explicit error if still undefined.

---

## Complete Code Changes

### File 1: `server/routers.ts`

Replace the entire `contact` router block with the following corrected version:

```typescript
contact: router({
    submit: publicProcedure
        .input(
            z.object({
                name: z.string().min(1),
                email: z.string().email(),
                phone: z.string().optional(),
                service: z.string().optional(),
                message: z.string().min(1),
            })
        )
        .mutation(async ({ input }) => {
            const GHL_API_KEY = process.env.GHL_API_KEY;
            const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
            const GHL_PIPELINE_ID = process.env.GHL_PIPELINE_ID;
            const GHL_PIPELINE_STAGE_ID = process.env.GHL_PIPELINE_STAGE_ID;

            if (!GHL_API_KEY || !GHL_LOCATION_ID) {
                throw new Error("GHL API credentials not configured");
            }

            // Safely split name — handles single-name entries
            const nameParts = input.name.trim().split(/\s+/).filter(Boolean);
            const firstName = nameParts[0] || input.name.trim();
            const lastName = nameParts.slice(1).join(" ");
            const serviceValue = input.service?.trim() || "General";

            // Rich note body with full context
            const noteText = [
                "Website inquiry submitted from royalresults.pro",
                `Name: ${input.name}`,
                `Email: ${input.email}`,
                `Phone: ${input.phone || "Not provided"}`,
                `Service Interest: ${serviceValue}`,
                `Message: ${input.message}`,
            ].join("\n");

            // Contact create payload — no customField (removed broken placeholder)
            const contactPayload = {
                locationId: GHL_LOCATION_ID,
                firstName,
                lastName,
                email: input.email,
                phone: input.phone || undefined,
                source: "Website Contact Form",
                tags: [
                    "website-inquiry",
                    serviceValue.toLowerCase().replace(/\s+/g, "-"),
                ],
            };

            // Step 1 — Create or update contact
            const res = await fetch(
                "https://services.leadconnectorhq.com/contacts/",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${GHL_API_KEY}`,
                        "Content-Type": "application/json",
                        Version: "2021-07-28",
                    },
                    body: JSON.stringify(contactPayload),
                }
            );

            if (!res.ok) {
                const errorBody = await res.text();
                console.error("GHL contact create error:", res.status, errorBody);
                throw new Error("Failed to submit contact to CRM");
            }

            const contactData = await res.json();
            // Handle both response shapes GHL can return
            const contactId = contactData?.contact?.id ?? contactData?.id;

            if (!contactId) {
                console.error("GHL contact response missing id:", contactData);
                throw new Error("Contact created but no contact id returned from CRM");
            }

            // Step 2 — Add detailed note (FIX: contactId not userId)
            await fetch(
                `https://services.leadconnectorhq.com/contacts/${contactId}/notes`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${GHL_API_KEY}`,
                        "Content-Type": "application/json",
                        Version: "2021-07-28",
                    },
                    body: JSON.stringify({
                        contactId,               // ← FIXED (was userId)
                        body: noteText,
                    }),
                }
            ).then(async noteRes => {
                if (!noteRes.ok) {
                    const noteError = await noteRes.text();
                    console.error("GHL note create error:", noteRes.status, noteError);
                }
            }).catch(err => console.error("Failed to add note:", err));

            // Step 3 — Create opportunity (only if pipeline vars are set)
            if (GHL_PIPELINE_ID && GHL_PIPELINE_STAGE_ID) {
                await fetch(
                    "https://services.leadconnectorhq.com/opportunities/",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${GHL_API_KEY}`,
                            "Content-Type": "application/json",
                            Version: "2021-07-28",
                        },
                        body: JSON.stringify({
                            locationId: GHL_LOCATION_ID,
                            pipelineId: GHL_PIPELINE_ID,
                            pipelineStageId: GHL_PIPELINE_STAGE_ID,
                            contactId,
                            name: `${input.name} — ${serviceValue}`,
                            status: "open",
                            source: "Website Contact Form",
                        }),
                    }
                ).then(async oppRes => {
                    if (!oppRes.ok) {
                        const oppError = await oppRes.text();
                        console.error("GHL opportunity error:", oppRes.status, oppError);
                    }
                }).catch(err => console.error("Failed to create opportunity:", err));
            }

            return { success: true, contactId };
        }),
}),
```

**Summary of changes to `routers.ts`:**

| Line(s) | Change | Reason |
|---------|--------|--------|
| ~47 | Add `GHL_PIPELINE_ID`, `GHL_PIPELINE_STAGE_ID` vars | Required for opportunity creation |
| ~51–53 | Fix name split to use regex `/\s+/` + `.filter(Boolean)` | Handles multiple spaces, single-name entries |
| ~55 | Add `serviceValue` normalization | Cleaner tag + note output |
| ~57–64 | Expand `noteText` to include all fields | Richer context in GHL contact record |
| ~66–74 | Extract `contactPayload` as named const | Remove broken `customField` block |
| ~103 | Fix `contactData?.contact?.id ?? contactData?.id` | Handle both GHL response shapes |
| ~105–109 | Throw on missing `contactId` | Prevent silent failures |
| ~113 | Fix `userId` → `contactId` in note body | **Primary bug fix — notes were silently failing** |
| ~115–120 | Add `.then()` to check note HTTP status | Surface non-2xx note errors |
| ~124–145 | Add opportunity creation block | New feature — leads enter pipeline |
| ~147 | Return `{ success: true, contactId }` | Useful for debugging |

---

### File 2: `.env.example`

Append the following two new variables to the existing GHL section:

```env
# --- GoHighLevel (GHL) CRM -------------------------------------------
# Settings > Private Integrations > Royal Results Website > Access Token
GHL_API_KEY=
# GHL Location ID (found in the URL: /location/{LOCATION_ID}/)
GHL_LOCATION_ID=
# Opportunities > select your pipeline > copy ID from the URL
GHL_PIPELINE_ID=
# The ID of the first stage in that pipeline (e.g. "New Lead")
GHL_PIPELINE_STAGE_ID=
```

---

### File 3: `client/src/components/ContactSection.tsx`

**No changes needed to the UI.** The form already:
- Uses `trpc.contact.submit.useMutation()` correctly
- Has `onSuccess` toast: `"Message sent! We'll be in touch shortly. 👑"`
- Has `onError` toast: `` `Failed to send message: ${err.message}` ``
- Resets the form state on success
- Sends all five fields: `name`, `email`, `phone`, `service`, `message`

The frontend is complete and will work correctly once the server bugs are fixed.

---

## GHL-Side Configuration Steps

These are performed in the GoHighLevel dashboard for sub-account `0PFDiGrgne4sbE4dJEC6` — **none require code changes**.

### Step 1 — Verify or Create API Key

1. Go to **GHL → Settings → Integrations → Private Integrations**
2. Find "Royal Results Website" integration (or create one)
3. Confirm the Access Token matches `GHL_API_KEY` in `.env`
4. Confirm it has scopes: `contacts.write`, `contacts/notes.write`, `opportunities.write`

### Step 2 — Get Pipeline and Stage IDs

1. Go to **GHL → CRM → Pipelines**
2. Open or create the "Royal Results" pipeline
3. Copy the pipeline ID from the browser URL: `/pipelines/{PIPELINE_ID}/`
4. Click on the first stage (e.g., "New Lead") → copy its stage ID from the URL or API
5. Add both to `.env` and GitHub Secrets as `GHL_PIPELINE_ID` and `GHL_PIPELINE_STAGE_ID`

### Step 3 — Add GitHub Secrets

1. Go to `https://github.com/jeremiahvanwagner-droid/royal-results-pro/settings/secrets/actions`
2. Add two new repository secrets:
   - `GHL_PIPELINE_ID` — the pipeline ID from Step 2
   - `GHL_PIPELINE_STAGE_ID` — the stage ID from Step 2
3. Confirm existing secrets are present: `GHL_API_KEY`, `GHL_LOCATION_ID`

### Step 4 — Create GHL Automation Workflow

1. Go to **GHL → Automations → Workflows → + New Workflow**
2. Name it: `Royal Results — Website Lead Nurture`
3. Configure trigger:
   - **Trigger:** Contact Created
   - **Filter:** Tag `contains` `website-inquiry`
4. Add actions in sequence:

| Step | Action | Detail |
|------|--------|--------|
| 1 | Wait | 0 minutes (immediate) |
| 2 | Send Email | Confirmation to lead: "Thanks for reaching out to Royal Results" |
| 3 | Send Internal Notification | Email or SMS to Rahiem @ 210-859-6838 |
| 4 | Wait | 1 day |
| 5 | Send SMS | Follow-up to lead |
| 6 | Wait | 3 days |
| 7 | Send Email | Value-add follow-up |
| 8 | If/Else | Check if opportunity stage is still "New Lead" → move to "Contacted" |

5. Save and **Publish** the workflow

### Step 5 — Verify Custom Fields (Optional Enhancement)

If you want service interest tracked as a dedicated custom field in GHL (not just in tags/notes):

1. Go to **GHL → Settings → Custom Fields**
2. Create a new field: Name = `Service Interest`, Type = `Text`
3. Note the field `key` (format: `contact.service_interest`)
4. In `server/routers.ts`, add to `contactPayload`:
   ```typescript
   customFields: [
     { key: "contact.service_interest", field_value: serviceValue }
   ]
   ```
   Note: GHL v2 API uses `customFields` (array of `{ key, field_value }`) — NOT `customField` with an `id`.

---

## How to Apply the Code Changes

### Method A — GitHub Web Editor (No Local Setup)

1. Go to: `https://github.com/jeremiahvanwagner-droid/royal-results-pro/blob/main/server/routers.ts`
2. Click the **pencil ✏️ icon** (Edit this file)
3. Select all → paste the corrected `routers.ts` content (full file from the Code Changes section above, merged with the existing file structure)
4. At the bottom under "Commit changes":
   - **Branch:** Create a new branch named `fix/ghl-contact-integration`
   - **Commit message:** `fix: correct GHL note field, remove broken customField, add opportunity creation`
5. Click **Propose changes** → **Create pull request**
6. Merge the PR

### Method B — Local / VS Code Terminal

```bash
cd royal-results-pro
git checkout -b fix/ghl-contact-integration
# Edit server/routers.ts with the corrected contact block
# Edit .env.example with the two new GHL vars
git add server/routers.ts .env.example
git commit -m "fix: correct GHL note contactId field, remove broken customField, add opportunity creation"
git push origin fix/ghl-contact-integration
# Open PR on GitHub, merge to main
```

### Method C — Claude Code / AI IDE

Open the repo in VS Code with Claude Code or Copilot, paste this plan, and say:  
> "Apply all changes in the Code Changes section to `server/routers.ts` and `.env.example`, then create a branch `fix/ghl-contact-integration` and open a PR."

---

## Environment Variables — Complete Reference

| Variable | Where Set | Value Source |
|----------|-----------|--------------|
| `GHL_API_KEY` | `.env` + GitHub Secret | GHL → Settings → Integrations → Private Integrations → Access Token |
| `GHL_LOCATION_ID` | `.env` + GitHub Secret | `0PFDiGrgne4sbE4dJEC6` (from GHL URL) |
| `GHL_PIPELINE_ID` | `.env` + GitHub Secret | GHL → CRM → Pipelines → pipeline URL |
| `GHL_PIPELINE_STAGE_ID` | `.env` + GitHub Secret | GHL → CRM → Pipelines → first stage ID |

---

## Testing Procedure

After all code changes are deployed and GHL config is complete, follow this exact test sequence:

### Test 1 — Form Submission (Happy Path)

1. Open `https://royalresults.pro` → scroll to "Let's Connect"
2. Fill in: Name = `Test Lead`, Email = `test@example.com`, Phone = `2105551234`, Service = `Counseling`, Message = `This is a test submission`
3. Click **Send Message**
4. **Expected frontend result:** Gold toast appears — "Message sent! We'll be in touch shortly. 👑"
5. In GHL → Contacts → search `test@example.com`:
   - ✅ Contact record exists with first name `Test`, last name `Lead`
   - ✅ Tags: `website-inquiry`, `counseling`
   - ✅ Source: `Website Contact Form`
6. Click into the contact → **Notes tab**:
   - ✅ Note exists with full submission details
   - ✅ Note body contains phone, service, message
7. Go to **CRM → Pipelines → your pipeline**:
   - ✅ Opportunity `Test Lead — Counseling` is in the first stage

### Test 2 — Automation Trigger

1. After Test 1, check your email within 2–3 minutes
2. ✅ Confirmation email should arrive at `test@example.com` (if workflow was set up)
3. ✅ Internal notification should arrive at Rahiem's contact method

### Test 3 — Missing Fields (Edge Case)

1. Submit the form with only name, email, and message (no phone, no service)
2. ✅ Contact created with tag `website-inquiry` and `general`
3. ✅ Note shows `Phone: Not provided` and `Service Interest: General`
4. ✅ No 500 error on the frontend

### Test 4 — Single Name Entry (Edge Case)

1. Submit with name = `Rahiem` (no last name)
2. ✅ GHL contact shows `firstName: Rahiem`, `lastName: ""` (empty string, not undefined)

---

## Execution Checklist

```
PHASE 1 — GHL DASHBOARD CONFIG
[ ] 1. Verify GHL API key has required scopes (contacts.write, notes.write, opportunities.write)
[ ] 2. Open or create Royal Results pipeline in GHL → CRM → Pipelines
[ ] 3. Copy pipeline ID from URL
[ ] 4. Copy first stage ID from URL
[ ] 5. Add GHL_PIPELINE_ID + GHL_PIPELINE_STAGE_ID to GitHub Secrets
[ ] 6. Add GHL_PIPELINE_ID + GHL_PIPELINE_STAGE_ID to production .env

PHASE 2 — CODE CHANGES
[ ] 7. Open server/routers.ts
[ ] 8. Replace contact router block with corrected version (see Code Changes → File 1)
[ ] 9. Remove broken customField block
[ ] 10. Fix userId → contactId in note body
[ ] 11. Add dual contactId extraction (?.contact?.id ?? ?.id)
[ ] 12. Add note response error checking
[ ] 13. Add opportunity creation block
[ ] 14. Update .env.example with two new GHL variables
[ ] 15. Commit on branch fix/ghl-contact-integration
[ ] 16. Open PR → review → merge to main

PHASE 3 — GHL AUTOMATION
[ ] 17. Create "Royal Results — Website Lead Nurture" workflow in GHL Automations
[ ] 18. Set trigger: Contact Created, filter: tag = website-inquiry
[ ] 19. Add confirmation email action (immediate)
[ ] 20. Add internal notification action (immediate)
[ ] 21. Add follow-up SMS action (1 day delay)
[ ] 22. Add follow-up email action (3 day delay)
[ ] 23. Publish workflow

PHASE 4 — TESTING
[ ] 24. Submit test form on royalresults.pro (happy path)
[ ] 25. Verify contact in GHL Contacts
[ ] 26. Verify note on contact
[ ] 27. Verify opportunity in pipeline
[ ] 28. Verify automation emails/SMS triggered
[ ] 29. Test edge cases: no phone, no service, single name
[ ] 30. Remove test contact from GHL after verification
```

---

## Files Modified Summary

| File | Type | Change |
|------|------|--------|
| `server/routers.ts` | Bug fix + Feature | Fix 4 bugs, add opportunity creation |
| `.env.example` | Documentation | Add 2 new GHL env var entries |
| `client/src/components/ContactSection.tsx` | None | Already correct — no changes needed |

No new packages or dependencies are required. All GHL API calls use native `fetch()` which is already available in the Node.js runtime.
