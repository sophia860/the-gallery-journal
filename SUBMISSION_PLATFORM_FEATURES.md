# Ideal Submission Platform Features: An Editor's Wishlist

*A comprehensive feature specification for The Gallery literary journal*

---

## Executive Summary

As editors managing a poetry journal's submission pipeline, the choice of submission management platform profoundly shapes both our editorial workflow and submitter experience. This document outlines the features we'd want in an ideal submission platform, drawing from experience with systems like Submittable, Subfolio, and Duotrope.

---

## 1. Core Submission Intake

### 1.1 Flexible Form Building
- [ ] **Unlimited custom fields** (not capped at 5 like Submittable Basic)
- [ ] **Conditional logic** - branching questions based on responses
- [ ] **Multiple file type support** - .doc, .docx, .pdf, .rtf, .txt, .odt
- [ ] **File preview without download** - inline reading for efficiency
- [ ] **Drag-and-drop reordering** of form fields
- [ ] **Form templates** - save and reuse configurations across categories

### 1.2 Submission Caps & Reading Windows
- [ ] **Fixed submission limits** per category (e.g., 500 submissions max)
- [ ] **Scheduled opening/closing** - set dates months in advance
- [ ] **Auto-close when quotas met** - prevents inbox overwhelm
- [ ] **Rolling submissions** with automatic issue assignment
- [ ] **Waitlist functionality** when categories reach capacity
- [ ] **Category-specific limits** (separate caps for poetry vs. prose)

### 1.3 Submission Fee Management
- [ ] **Low transaction fees** (≤3% + minimal flat fee)
- [ ] **Fee waivers** - automatic or code-based for financial hardship
- [ ] **Tiered pricing** - different fees for different categories
- [ ] **Bundled submissions** - discount for multiple pieces
- [ ] **Expedited review option** - premium fast-track reading
- [ ] **Transparent fee reporting** for tax/accounting purposes

---

## 2. Anonymous Review & Bias Reduction

### 2.1 Blind Review Capability
- [ ] **One-click blind mode** - hide author names from readers
- [ ] **Metadata concealment** - hide biographical info, location, institution
- [ ] **Flexible unblinding points** - configure when identity reveals
- [ ] **Document-level redaction** - flag potentially identifying content
- [ ] **Double-blind option** - hide reader identities from each other

### 2.2 Conflict of Interest Management
- [ ] **Automatic COI flagging** - when submission matches staff connections
- [ ] **Recusal workflow** - easy process to remove oneself from review
- [ ] **Affiliation tracking** - log relationships for transparency
- [ ] **Previous acceptance history** - flag repeat submitters if desired

---

## 3. Reader Management & Team Collaboration

### 3.1 Assignment Workflows
- [ ] **Round-robin auto-assignment** - distribute evenly across readers
- [ ] **Workload balancing** - cap how many each reader receives
- [ ] **Manual override** - assign specific pieces to expert readers
- [ ] **Multi-round review** - first readers → senior editors pipeline
- [ ] **Reassignment notifications** - alert readers when work moves to them
- [ ] **Deadline reminders** - automated nudges for pending reviews

### 3.2 Review Interface
- [ ] **Integrated discussion panel** - Slack/Discord-style threaded chat
- [ ] **@mentions** - tag team members in comments
- [ ] **Inline annotations** - comment on specific lines of text
- [ ] **Side-by-side comparison** - view multiple submissions together
- [ ] **Reading history** - track what each reader has seen

### 3.3 Scoring Systems
- [ ] **Flexible rating scales** - Yes/Maybe/No, 1-10, A-F, stars
- [ ] **Custom rubrics** - define evaluation criteria per category
- [ ] **Weighted scoring** - prioritize certain criteria
- [ ] **Consensus tracking** - visualize agreement/disagreement
- [ ] **Score normalization** - adjust for harsh/lenient readers

---

## 4. Communication Tools

### 4.1 Submitter Communication
- [ ] **Template library** - pre-written responses for common scenarios
- [ ] **Variable insertion** - auto-fill name, title, submission date
- [ ] **Batch messaging** - send updates to multiple submitters
- [ ] **Scheduled sends** - queue responses for specific times
- [ ] **Response tracking** - log all communications
- [ ] **Personalized rejections** - tiered rejection with feedback options

### 4.2 Internal Communication
- [ ] **Team announcements** - broadcast to all readers
- [ ] **Private notes** - internal comments invisible to submitters
- [ ] **Activity feed** - see recent team actions at a glance
- [ ] **Integration with Slack/Discord** - push notifications to existing tools

---

## 5. Analytics & Reporting

### 5.1 Submission Metrics
- [ ] **Volume tracking** - submissions over time, by category
- [ ] **Demographics** - geographic distribution, repeat submitters
- [ ] **Conversion rates** - submissions to acceptances ratio
- [ ] **Response time** - average days to decision
- [ ] **Category performance** - which types get most interest

### 5.2 Reader Metrics
- [ ] **Workload reports** - submissions reviewed per reader
- [ ] **Turnaround time** - individual reader speed
- [ ] **Acceptance correlation** - whose picks get published
- [ ] **Activity patterns** - peak reading times

### 5.3 Exportable Reports
- [ ] **CSV/Excel export** - raw data for external analysis
- [ ] **PDF reports** - formatted summaries for stakeholders
- [ ] **API access** - integrate with custom dashboards
- [ ] **Scheduled reports** - automatic weekly/monthly summaries

---

## 6. Submitter Experience

### 6.1 Account Management
- [ ] **Social login** - Google, Facebook, Twitter authentication
- [ ] **Portfolio view** - all past submissions in one place
- [ ] **Status tracking** - clear progress indicators
- [ ] **Submission history** - searchable archive of past work
- [ ] **Favorite publications** - bookmark for future submissions

### 6.2 Submission Process
- [ ] **Save drafts** - return to incomplete submissions
- [ ] **Cover letter templates** - save and reuse
- [ ] **Simultaneous submission tracking** - manage multiple pending
- [ ] **Withdrawal option** - easy self-service withdrawal
- [ ] **Mobile-friendly** - responsive design for phone submissions

### 6.3 Transparency
- [ ] **Estimated response time** - set expectations upfront
- [ ] **Queue position** - optional display of place in line
- [ ] **Reading period status** - clearly show open/closed
- [ ] **Past acceptance rates** - transparency about selectivity

---

## 7. Publishing Pipeline Integration

### 7.1 Acceptance Workflow
- [ ] **Contract generation** - auto-create contributor agreements
- [ ] **E-signature collection** - legally binding digital signatures
- [ ] **Bio collection** - gather updated author information
- [ ] **Photo requests** - headshot upload for contributor pages
- [ ] **Payment processing** - integrated contributor payments

### 7.2 Editorial Pipeline
- [ ] **Copyediting workflow** - track revision stages
- [ ] **Galley proofs** - share formatted versions for approval
- [ ] **Publication scheduling** - assign to specific issues/dates
- [ ] **CMS integration** - push accepted work to WordPress, Ghost, etc.

---

## 8. Technical Requirements

### 8.1 Security & Privacy
- [ ] **GDPR compliance** - data protection for international submitters
- [ ] **Two-factor authentication** - secure staff accounts
- [ ] **Role-based permissions** - granular access control
- [ ] **Audit logs** - track who did what and when
- [ ] **Data export** - submitters can download their data
- [ ] **Auto-deletion** - purge old submissions per policy

### 8.2 Accessibility
- [ ] **Screen reader compatible** - WCAG 2.1 AA compliance
- [ ] **Keyboard navigation** - full functionality without mouse
- [ ] **High contrast mode** - visual accessibility options
- [ ] **Text scaling** - adjustable font sizes

### 8.3 Performance
- [ ] **Fast load times** - under 3 seconds page load
- [ ] **Offline capability** - read submissions without connection
- [ ] **Bulk operations** - batch actions without timeouts
- [ ] **File size limits** - generous but reasonable (50MB+)

---

## 9. Pricing Considerations

### Ideal Pricing Model
| Tier | Monthly Cost | Submissions | Team Seats | Categories |
|------|-------------|-------------|------------|------------|
| Starter | Free or $10 | 100/month | 5 | 3 |
| Growing | $25-40 | 500/month | 15 | 10 |
| Professional | $50-75 | 2000/month | Unlimited | Unlimited |
| Enterprise | Custom | Unlimited | Unlimited | Unlimited |

### Deal Breakers
- Per-submission fees above $0.50
- Transaction fees above 5%
- Mandatory annual contracts
- No free tier for small publications
- Hidden fees for essential features

---

## 10. Nice-to-Have Features

- [ ] **AI-assisted spam detection** - flag suspicious submissions
- [ ] **Plagiarism checking** - integration with Turnitin or similar
- [ ] **Genre auto-tagging** - ML-based categorization
- [ ] **Sentiment analysis** - mood/tone indicators
- [ ] **Similar work detection** - flag potential duplicates
- [ ] **Reading time estimates** - word count to minutes conversion
- [ ] **Dark mode** - for late-night reading sessions
- [ ] **Browser extensions** - quick-submit from any page
- [ ] **Calendar integration** - sync deadlines to Google Calendar
- [ ] **Nomination tracking** - Pushcart, Best of the Net workflow

---

## Platform Comparison Notes

| Feature | Submittable | Subfolio | Duosuma | Dapple |
|---------|-------------|----------|---------|--------|
| Price (entry) | $199/mo | Free tier | Free tier | Free tier |
| Unlimited forms | Premium only | Yes | Yes | Yes |
| Team chat | No | Yes | No | No |
| Anonymous review | Yes | Yes | Yes | Yes |
| API access | Premium | No | No | No |
| Mobile app | Yes | No | No | No |

---

## Implementation Priority

### Phase 1 (Must Have)
1. Anonymous/blind review
2. Flexible form building
3. Team assignment workflow
4. Template-based responses
5. Basic analytics

### Phase 2 (Should Have)
1. Integrated team chat
2. Advanced scoring rubrics
3. Contract/e-signature workflow
4. Detailed reporting

### Phase 3 (Nice to Have)
1. AI-assisted features
2. CMS integration
3. Mobile app
4. API access

---

*Document created for The Gallery literary journal - Winter 2026 planning*
*Last updated: February 2026*
