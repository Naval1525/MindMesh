# 🎯 MindMesh Feedback System Setup Guide

## 📋 Direct Google Forms Integration

### 1. **Get Your Google Form URL**

1. Open your Google Form: "Mind Mesh Feedback form"
2. Click the **"Send"** button (top right)
3. Copy the **form URL** (it should look like: `https://docs.google.com/forms/d/e/1FAIpQLS.../viewform`)
4. Replace `/viewform` with `/formResponse` at the end

### 2. **Find Your Field IDs**

1. Right-click on your **Feedback** question and select **"Inspect"**
2. Look for the `name` attribute in the HTML (e.g., `name="entry.2038293830"`)
3. Note down this ID for the feedback field
4. Do the same for the **Email** field

### 3. **Update the Code**

1. Open `src/components/FeedbackModal.tsx`
2. Replace `YOUR_ACTUAL_FORM_ID` with your actual form ID
3. Replace `entry.2038293830` with your actual feedback field ID
4. Replace `entry.1234567890` with your actual email field ID

### 4. **Test the Integration**

1. Start your development server: `npm run dev`
2. Open the feedback modal in your app
3. Submit a test feedback
4. Check your Google Form responses to see if it worked

## 🔧 Quick Configuration

In `src/components/FeedbackModal.tsx`, update these lines:

```typescript
// Line ~30: Replace with your form URL
const formUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';

// Line ~45: Replace with your actual field IDs
formData.append('entry.YOUR_FEEDBACK_FIELD_ID', formReaction);
formData.append('entry.YOUR_EMAIL_FIELD_ID', email.trim());
```

## 🎉 You're Ready!

Once configured, users can:
- Click the feedback button (💬) in the toolbar
- Get auto-prompted after 30 seconds of use
- Select an emoji reaction
- Optionally provide their email
- Submit feedback directly to your Google Form

The feedback will appear in your Google Form responses immediately! 🚀

## 🔄 Troubleshooting

**"Form not found" error:**
- Make sure you're using the correct form ID
- Check that the form is published and accessible

**"Field not found" error:**
- Verify the field IDs are correct
- Make sure you're using the `entry.` prefix

**"CORS error" in browser:**
- This is normal for local development
- The form submission will work when deployed to production