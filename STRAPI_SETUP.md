# Strapi Content Types Configuration

This document describes the content types that need to be created in the Strapi Cloud admin panel.

## Base URL
https://supportive-ducks-9506a8aa47.strapiapp.com

## 1. User Profile Extension

The default User content type from the Users & Permissions plugin needs to be extended with additional fields.

Navigate to: **Content-Type Builder → User (from Users & Permissions plugin)**

### Add the following fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `displayName` | Text (Short text) | No | User's display name for public viewing |
| `bio` | Text (Long text) | No | User biography/about section |
| `profileImage` | Media (Single media) | No | User's profile picture |
| `socialLinks` | JSON | No | Object containing social media links |
| `role` | Enumeration | No | Values: `poet`, `editor` (in addition to Strapi's built-in role system) |

### socialLinks JSON Structure:
```json
{
  "twitter": "https://twitter.com/username",
  "instagram": "https://instagram.com/username",
  "website": "https://example.com",
  "other": "https://..."
}
```

## 2. Submission Content Type

Create a new Collection Type called **Submission**.

Navigate to: **Content-Type Builder → Create new collection type**

### Collection Type: `submission`

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| `title` | Text (Short text) | Yes | Title of the poem/article |
| `body` | Rich text | Yes | Full text of the submission |
| `status` | Enumeration | Yes | Values: `draft`, `submitted`, `under_review`, `approved`, `published`, `rejected` |
| `author` | Relation | Yes | Many-to-One relation with User |
| `lastSaved` | DateTime | Yes | Auto-updated on each save |
| `submittedAt` | DateTime | No | When submitted for review |
| `reviewedAt` | DateTime | No | When reviewed by editor |
| `publishedAt` | DateTime | No | When published (note: different from Strapi's built-in publishedAt) |
| `editorNotes` | Text (Long text) | No | Feedback from editors |
| `versionHistory` | JSON | No | Track changes over time |
| `category` | Text (Short text) | No | Poetry category/theme |
| `tags` | JSON | No | Array of tags for categorization |

### Relation Configuration:
- **author**: 
  - Type: Relation
  - Relation type: Many Submissions to One User (from users-permissions)
  - Field name on User side: `submissions`

### versionHistory JSON Structure:
```json
[
  {
    "version": 1,
    "timestamp": "2026-02-02T14:00:00.000Z",
    "title": "Original Title",
    "body": "Original content...",
    "changes": "Initial version"
  },
  {
    "version": 2,
    "timestamp": "2026-02-02T15:30:00.000Z",
    "title": "Updated Title",
    "body": "Updated content...",
    "changes": "Revised opening stanza"
  }
]
```

## 3. User Roles Configuration

### Poet Role

Navigate to: **Settings → Roles (Users & Permissions plugin) → Create new role**

**Role Name:** Poet

**Permissions for Submission content type:**
- `find`: ✅ (own submissions only - configure with conditions)
- `findOne`: ✅ (own submissions only)
- `create`: ✅
- `update`: ✅ (own submissions only)
- `delete`: ✅ (own submissions only)

**Permissions for User:**
- `me`: ✅ (view own profile)
- `find`: ❌
- `findOne`: ❌ (except own)
- `update`: ✅ (own profile only)

**Advanced Settings:**
Set conditions to ensure poets can only access their own submissions:
- In the role permissions, add a condition: `author.id === $user.id`

### Editor Role

Navigate to: **Settings → Roles → Create new role**

**Role Name:** Editor

**Permissions for Submission content type:**
- `find`: ✅ (all submissions)
- `findOne`: ✅ (all submissions)
- `create`: ✅
- `update`: ✅ (all submissions)
- `delete`: ✅ (all submissions)

**Permissions for User:**
- `me`: ✅
- `find`: ✅ (view all users)
- `findOne`: ✅
- `update`: ✅ (all users)

**Additional Permissions:**
- Editors should have access to manage categories if you create a Category content type

## 4. API Endpoints Configuration

Ensure the following endpoints are accessible:

### Authentication Endpoints (Built-in):
- `POST /api/auth/local` - Login
- `POST /api/auth/local/register` - Registration
- `GET /api/users/me` - Get current user profile

### Submission Endpoints (Custom):
- `GET /api/submissions` - Get all submissions (filtered by role)
- `GET /api/submissions/:id` - Get specific submission
- `POST /api/submissions` - Create new submission
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission

### Custom Routes (Optional)

You can add custom routes in Strapi for additional functionality:

Create: `src/api/submission/routes/custom-submission.js`

```javascript
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/submissions/drafts',
      handler: 'submission.findDrafts',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/submissions/:id/submit',
      handler: 'submission.submitForReview',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/submissions/:id/approve',
      handler: 'submission.approve',
      config: {
        policies: ['isEditor'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/submissions/:id/reject',
      handler: 'submission.reject',
      config: {
        policies: ['isEditor'],
        middlewares: [],
      },
    },
  ],
};
```

## 5. Session & Token Configuration

Navigate to: **Settings → Users & Permissions plugin → Advanced Settings**

Configure JWT settings:
- **JWT expiration time**: `7d` (7 days) or as needed
- Enable **Allow registration**
- Set **Default role for authenticated users**: `Poet`

## 6. CORS Configuration

Ensure your frontend domain is allowed in CORS settings.

Navigate to: **Settings → Global settings → Security → CORS**

Add allowed origins:
```
https://sophia860.github.io
http://localhost:3000
```

## Testing the Configuration

### 1. Test Registration:
```javascript
POST https://supportive-ducks-9506a8aa47.strapiapp.com/api/auth/local/register
Content-Type: application/json

{
  "username": "testpoet",
  "email": "poet@example.com",
  "password": "Test123!@#"
}
```

### 2. Test Login:
```javascript
POST https://supportive-ducks-9506a8aa47.strapiapp.com/api/auth/local
Content-Type: application/json

{
  "identifier": "poet@example.com",
  "password": "Test123!@#"
}
```

### 3. Test Get Profile:
```javascript
GET https://supportive-ducks-9506a8aa47.strapiapp.com/api/users/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Test Create Submission:
```javascript
POST https://supportive-ducks-9506a8aa47.strapiapp.com/api/submissions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "data": {
    "title": "Test Poem",
    "body": "Roses are red...",
    "status": "draft"
  }
}
```

## Troubleshooting

### Issue: Cannot create submissions
- Check that the Submission content type is created
- Verify role permissions for the authenticated user
- Ensure the user is authenticated (valid JWT token)

### Issue: 403 Forbidden
- Check role permissions in Settings → Roles
- Verify the user has the correct role assigned
- Check relation permissions (author field)

### Issue: CORS errors
- Add your frontend domain to allowed origins
- Check that credentials are included in requests

## Next Steps

After configuring these content types in Strapi Cloud:
1. Create a test poet user
2. Create a test editor user
3. Test the authentication flow
4. Create test submissions
5. Test the approval workflow
