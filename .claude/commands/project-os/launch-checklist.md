# Launch Checklist

You are acting as a **Release Manager**. Your job is to generate a comprehensive launch checklist based on what this project has built.

## Prerequisites

Read:
- `projects/[project-id]/project-context.md`
- `projects/[project-id]/plan/prd.md` (if exists)
- `projects/[project-id]/build/sprint-status.json` (if exists)
- `projects/[project-id]/product/product-roadmap.md` (if exists)

## Step 1: Confirm Scope

Ask the user:
- "What environment are we launching to? (production, staging, public beta)"
- "Are there any sections/features not yet built that should be flagged as blocked?"
- "Any specific compliance or security requirements to verify?"

## Step 2: Generate Checklist

Create `projects/[project-id]/ship/launch-checklist.md`:

```markdown
# Launch Checklist

**Project:** [Project Name]
**Target:** [environment]
**Generated:** [date]

---

## Pre-Launch

### Product Completeness
- [ ] All v1 sections/features built and tested
- [ ] Empty states handled for all screens
- [ ] Error states handled (network errors, 404s, auth errors)
- [ ] Mobile responsive verified on iOS and Android
- [ ] Dark mode verified (if applicable)

### Data & Backend
- [ ] Database schema finalized and migrations run
- [ ] Sample/seed data removed from production
- [ ] Backup strategy in place
- [ ] Data retention policy defined

### Auth & Security
- [ ] Authentication flow tested end-to-end
- [ ] Password reset flow working
- [ ] Session timeout configured
- [ ] HTTPS enforced
- [ ] Sensitive data not logged

### Performance
- [ ] Lighthouse score > 80 on core pages
- [ ] Images optimized and using CDN
- [ ] Critical path CSS inlined
- [ ] Bundle size checked

### Infrastructure
- [ ] Domain configured and DNS propagated
- [ ] SSL certificate valid
- [ ] Environment variables set in production
- [ ] Error monitoring (e.g., Sentry) configured
- [ ] Uptime monitoring configured

### Legal & Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent (if applicable)
- [ ] GDPR/CCPA compliance reviewed (if applicable)

---

## Launch Day

- [ ] Final smoke test on production
- [ ] Team notified
- [ ] Rollback plan documented
- [ ] Support channel ready

---

## Post-Launch (First Week)

- [ ] Error rate monitored
- [ ] User feedback collected
- [ ] Performance metrics reviewed
- [ ] [Any project-specific follow-ups]

---

## Blocked Items

[List any items that are not yet complete or need attention]
- [ ] [Blocked item — reason]
```

Customize the checklist based on what's in the PRD and sprint status. If certain sections are marked incomplete in sprint-status.json, add them as blocked items.

## Step 3: Update Orchestration

Update `projects/[project-id]/orchestration.json`:
- Set `current_phase` to `ship`

## Step 4: Confirm

"Launch checklist saved to `ship/launch-checklist.md`.

Work through the checklist and use `/sprint-status` to track any remaining build work. When you're ready to record a deployment, you can add it to `ship/deployments.json`."
